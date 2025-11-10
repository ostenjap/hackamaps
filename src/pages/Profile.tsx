import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, Trophy, Calendar, Upload } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

const Profile = () => {
  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const profileData = {
    name: "Wiecen",
    email: "wiecen@gmail.com",
    github: "https://github.com/wiecen",
    hackathonsAttended: [
      { name: "Global Hack Week 2024", location: "San Francisco, CA", date: "March 2024" },
      { name: "AI Innovation Summit", location: "Austin, TX", date: "January 2024" },
      { name: "DevCon Europe", location: "Berlin, Germany", date: "November 2023" },
      { name: "Web3 Builders Hackathon", location: "Online", date: "September 2023" },
    ],
    hackathonsWon: [
      { name: "AI Innovation Summit", prize: "1st Place - Best AI Application", amount: "$10,000" },
      { name: "Web3 Builders Hackathon", prize: "2nd Place - Most Creative", amount: "$5,000" },
    ],
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={selectedAvatar} alt={profileData.name} />
                  <AvatarFallback>W</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </span>
                    </Button>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <CardTitle className="text-3xl mb-2">{profileData.name}</CardTitle>
                <CardDescription className="text-lg mb-4">Hackathon Enthusiast & Developer</CardDescription>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center md:justify-start">
                  <a
                    href={`mailto:${profileData.email}`}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {profileData.email}
                  </a>
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </a>
                </div>

                <div className="flex gap-4 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{profileData.hackathonsAttended.length}</div>
                    <div className="text-sm text-muted-foreground">Attended</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.hackathonsWon.length}</div>
                    <div className="text-sm text-muted-foreground">Won</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Avatar Selection */}
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
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`rounded-full transition-all ${
                    selectedAvatar === avatar ? "ring-4 ring-primary" : "ring-2 ring-border hover:ring-primary/50"
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

        {/* Hackathons Won */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Hackathons Won
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileData.hackathonsWon.map((hackathon, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{hackathon.name}</h3>
                      <Badge variant="secondary" className="mb-2">{hackathon.prize}</Badge>
                      <p className="text-sm text-muted-foreground">Prize: {hackathon.amount}</p>
                    </div>
                    <Trophy className="h-6 w-6 text-primary flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hackathons Attended */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Hackathons Attended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profileData.hackathonsAttended.map((hackathon, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{hackathon.name}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>📍 {hackathon.location}</span>
                    <span>•</span>
                    <span>📅 {hackathon.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
