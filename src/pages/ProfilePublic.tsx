import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, Trophy, Calendar, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

const ProfilePublic = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hackathonsWon, setHackathonsWon] = useState<HackathonWon[]>([]);
  const [hackathonsAttended, setHackathonsAttended] = useState<HackathonAttended[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  ];

  useEffect(() => {
    fetchProfileByEmail("wiecen@gmail.com");
  }, []);

  const fetchProfileByEmail = async (email: string) => {
    // First get the user_id from auth.users via profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (profileError || !profileData) {
      console.error("Error fetching profile");
      return;
    }

    setProfile(profileData);
    setUserEmail(email);
    fetchHackathonsWon(profileData.user_id);
    fetchHackathonsAttended(profileData.user_id);
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
        {!profile ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading profile...</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          <>
            {/* Profile Header Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile?.avatar_url || avatarOptions[0]} alt={profile?.name || "User"} />
                    <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left">
                    <CardTitle className="text-3xl mb-2">{profile?.name || "User"}</CardTitle>
                    <CardDescription className="text-lg mb-4">Hackathon Enthusiast & Developer</CardDescription>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center md:justify-start">
                      <a
                        href={`mailto:${userEmail}`}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {userEmail}
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

            {/* Hackathons Won */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Hackathons Won
                </CardTitle>
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
                          <div className="text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {new Date(hackathon.date_won).toLocaleDateString()}
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
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Hackathons Attended
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hackathonsAttended.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No hackathons attended yet</p>
                ) : (
                  <div className="space-y-3">
                    {hackathonsAttended.map((hackathon) => (
                      <div key={hackathon.id} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{hackathon.hackathon_name}</h3>
                            <p className="text-sm text-muted-foreground">{hackathon.location}</p>
                          </div>
                          <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {hackathon.date_attended}
                          </div>
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
    </div>
  );
};

export default ProfilePublic;
