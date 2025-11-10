import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail, Trophy, Calendar, Upload, Edit, Plus, Trash2, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  github_url: string | null;
  avatar_url: string | null;
}

interface HackathonWon {
  id: string;
  hackathon_name: string;
  prize: string;
  amount: string | null;
  proof_url: string | null;
  date_won: string;
}

interface HackathonAttended {
  id: string;
  hackathon_name: string;
  location: string;
  date_attended: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hackathonsWon, setHackathonsWon] = useState<HackathonWon[]>([]);
  const [hackathonsAttended, setHackathonsAttended] = useState<HackathonAttended[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingWon, setIsAddingWon] = useState(false);
  const [isAddingAttended, setIsAddingAttended] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [editName, setEditName] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [newWonName, setNewWonName] = useState("");
  const [newWonPrize, setNewWonPrize] = useState("");
  const [newWonAmount, setNewWonAmount] = useState("");
  const [newWonProof, setNewWonProof] = useState("");
  const [newAttendedName, setNewAttendedName] = useState("");
  const [newAttendedLocation, setNewAttendedLocation] = useState("");
  const [newAttendedDate, setNewAttendedDate] = useState("");

  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  ];

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      fetchProfile(session.user.id);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      toast({ title: "Error fetching profile", variant: "destructive" });
      return;
    }

    if (!data) {
      // Create profile if it doesn't exist
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({ user_id: userId, name: user?.email?.split("@")[0] || "User" })
        .select()
        .single();

      if (insertError) {
        toast({ title: "Error creating profile", variant: "destructive" });
        return;
      }
      setProfile(newProfile);
    } else {
      setProfile(data);
    }

    fetchHackathonsWon(userId);
    fetchHackathonsAttended(userId);
  };

  const fetchHackathonsWon = async (userId: string) => {
    const { data, error } = await supabase
      .from("hackathons_won")
      .select("*")
      .eq("user_id", userId)
      .order("date_won", { ascending: false });

    if (!error && data) {
      setHackathonsWon(data);
    }
  };

  const fetchHackathonsAttended = async (userId: string) => {
    const { data, error } = await supabase
      .from("hackathons_attended")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setHackathonsAttended(data);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ name: editName, github_url: editGithub })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error updating profile", variant: "destructive" });
      return;
    }

    toast({ title: "Profile updated successfully!" });
    setIsEditingProfile(false);
    fetchProfile(user.id);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Error uploading avatar", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", user.id);

    if (updateError) {
      toast({ title: "Error updating avatar", variant: "destructive" });
    } else {
      toast({ title: "Avatar updated successfully!" });
      fetchProfile(user.id);
    }

    setUploading(false);
  };

  const handleSelectPresetAvatar = async (avatarUrl: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error updating avatar", variant: "destructive" });
    } else {
      toast({ title: "Avatar updated!" });
      fetchProfile(user.id);
    }
  };

  const handleAddHackathonWon = async () => {
    if (!user || !newWonName || !newWonPrize) return;

    const { error } = await supabase
      .from("hackathons_won")
      .insert({
        user_id: user.id,
        hackathon_name: newWonName,
        prize: newWonPrize,
        amount: newWonAmount || null,
        proof_url: newWonProof || null,
      });

    if (error) {
      toast({ title: "Error adding hackathon", variant: "destructive" });
      return;
    }

    toast({ title: "Hackathon win added!" });
    setIsAddingWon(false);
    setNewWonName("");
    setNewWonPrize("");
    setNewWonAmount("");
    setNewWonProof("");
    fetchHackathonsWon(user.id);
  };

  const handleDeleteHackathonWon = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("hackathons_won")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting hackathon", variant: "destructive" });
      return;
    }

    toast({ title: "Hackathon deleted" });
    fetchHackathonsWon(user.id);
  };

  const handleAddHackathonAttended = async () => {
    if (!user || !newAttendedName || !newAttendedLocation || !newAttendedDate) return;

    const { error } = await supabase
      .from("hackathons_attended")
      .insert({
        user_id: user.id,
        hackathon_name: newAttendedName,
        location: newAttendedLocation,
        date_attended: newAttendedDate,
      });

    if (error) {
      toast({ title: "Error adding hackathon", variant: "destructive" });
      return;
    }

    toast({ title: "Hackathon added!" });
    setIsAddingAttended(false);
    setNewAttendedName("");
    setNewAttendedLocation("");
    setNewAttendedDate("");
    fetchHackathonsAttended(user.id);
  };

  const handleDeleteHackathonAttended = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("hackathons_attended")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting hackathon", variant: "destructive" });
      return;
    }

    toast({ title: "Hackathon deleted" });
    fetchHackathonsAttended(user.id);
  };

  const isOwner = user?.email === "wiecen@gmail.com";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            HackathonMap
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>Please sign in to view profile</CardTitle>
              <CardDescription>You need to be signed in to access this page</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            {/* Profile Header Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profile?.avatar_url || avatarOptions[0]} alt={profile?.name || "User"} />
                      <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    {isOwner && (
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm" className="w-full" disabled={uploading} asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              {uploading ? "Uploading..." : "Upload Photo"}
                            </span>
                          </Button>
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                          disabled={uploading}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                      <CardTitle className="text-3xl">{profile?.name || "User"}</CardTitle>
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditName(profile?.name || "");
                            setEditGithub(profile?.github_url || "");
                            setIsEditingProfile(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardDescription className="text-lg mb-4">Hackathon Enthusiast & Developer</CardDescription>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center md:justify-start">
                      <a
                        href={`mailto:${user.email}`}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </a>
                      {profile?.github_url && (
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          GitHub Profile
                        </a>
                      )}
                    </div>

                    <div className="flex gap-4 justify-center md:justify-start">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{hackathonsAttended.length}</div>
                        <div className="text-sm text-muted-foreground">Attended</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{hackathonsWon.length}</div>
                        <div className="text-sm text-muted-foreground">Won</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Avatar Selection */}
            {isOwner && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Choose Avatar</CardTitle>
                  <CardDescription>Select from preset avatars or upload your own</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 flex-wrap">
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectPresetAvatar(avatar)}
                        className={`rounded-full transition-all ${
                          profile?.avatar_url === avatar ? "ring-4 ring-primary" : "ring-2 ring-border hover:ring-primary/50"
                        }`}
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={avatar} />
                          <AvatarFallback>A{index + 1}</AvatarFallback>
                        </Avatar>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hackathons Won */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Hackathons Won
                  </CardTitle>
                  {isOwner && (
                    <Button size="sm" onClick={() => setIsAddingWon(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {hackathonsWon.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No hackathons won yet</p>
                ) : (
                  <div className="space-y-4">
                    {hackathonsWon.map((hackathon) => (
                      <div key={hackathon.id} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{hackathon.hackathon_name}</h3>
                            <Badge variant="secondary" className="mb-2">{hackathon.prize}</Badge>
                            {hackathon.amount && (
                              <p className="text-sm text-muted-foreground mb-2">Prize: {hackathon.amount}</p>
                            )}
                            {hackathon.proof_url && (
                              <a
                                href={hackathon.proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                View Proof <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-primary flex-shrink-0" />
                            {isOwner && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteHackathonWon(hackathon.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hackathons Attended */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Hackathons Attended
                  </CardTitle>
                  {isOwner && (
                    <Button size="sm" onClick={() => setIsAddingAttended(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {hackathonsAttended.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No hackathons attended yet</p>
                ) : (
                  <div className="space-y-3">
                    {hackathonsAttended.map((hackathon) => (
                      <div key={hackathon.id} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{hackathon.hackathon_name}</h3>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                              <span>📍 {hackathon.location}</span>
                              <span>•</span>
                              <span>📅 {hackathon.date_attended}</span>
                            </div>
                          </div>
                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteHackathonAttended(hackathon.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="edit-github">GitHub URL</Label>
              <Input
                id="edit-github"
                value={editGithub}
                onChange={(e) => setEditGithub(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Hackathon Won Dialog */}
      <Dialog open={isAddingWon} onOpenChange={setIsAddingWon}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Hackathon Win</DialogTitle>
            <DialogDescription>Add a hackathon you won</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="won-name">Hackathon Name *</Label>
              <Input
                id="won-name"
                value={newWonName}
                onChange={(e) => setNewWonName(e.target.value)}
                placeholder="AI Innovation Summit"
              />
            </div>
            <div>
              <Label htmlFor="won-prize">Prize *</Label>
              <Input
                id="won-prize"
                value={newWonPrize}
                onChange={(e) => setNewWonPrize(e.target.value)}
                placeholder="1st Place - Best AI Application"
              />
            </div>
            <div>
              <Label htmlFor="won-amount">Prize Amount</Label>
              <Input
                id="won-amount"
                value={newWonAmount}
                onChange={(e) => setNewWonAmount(e.target.value)}
                placeholder="$10,000"
              />
            </div>
            <div>
              <Label htmlFor="won-proof">Proof URL</Label>
              <Input
                id="won-proof"
                value={newWonProof}
                onChange={(e) => setNewWonProof(e.target.value)}
                placeholder="https://example.com/proof"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingWon(false)}>Cancel</Button>
            <Button onClick={handleAddHackathonWon} disabled={!newWonName || !newWonPrize}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Hackathon Attended Dialog */}
      <Dialog open={isAddingAttended} onOpenChange={setIsAddingAttended}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Hackathon Attended</DialogTitle>
            <DialogDescription>Add a hackathon you attended</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="attended-name">Hackathon Name *</Label>
              <Input
                id="attended-name"
                value={newAttendedName}
                onChange={(e) => setNewAttendedName(e.target.value)}
                placeholder="DevCon Europe"
              />
            </div>
            <div>
              <Label htmlFor="attended-location">Location *</Label>
              <Input
                id="attended-location"
                value={newAttendedLocation}
                onChange={(e) => setNewAttendedLocation(e.target.value)}
                placeholder="Berlin, Germany"
              />
            </div>
            <div>
              <Label htmlFor="attended-date">Date *</Label>
              <Input
                id="attended-date"
                value={newAttendedDate}
                onChange={(e) => setNewAttendedDate(e.target.value)}
                placeholder="November 2023"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAttended(false)}>Cancel</Button>
            <Button onClick={handleAddHackathonAttended} disabled={!newAttendedName || !newAttendedLocation || !newAttendedDate}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
