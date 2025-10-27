import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Globe, MapPin, Users, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const scrollToPromotion = () => {
    document.getElementById("promotion")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-lg md:text-2xl font-bold font-['Exo_2'] tracking-tight">hackamaps.com</div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Semi-transparent map background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLW9wYWNpdHk9IjAuNCI+CiAgICAgIDxwYXRoIGQ9Ik0zNiAzNGMwLTEuMTA1LS44OTUtMi0yLTJzLTIgLjg5NS0yIDJ2NGMwIDEuMTA1Ljg5NSAyIDIgMnMyLS44OTUgMi0ydi00em0wLTEwYzAtMS4xMDUtLjg5NS0yLTItMnMtMiAuODk1LTIgMnY0YzAgMS4xMDUuODk1IDIgMiAyczItLjg5NSAyLTJ2LTR6bTAgMThjMC0xLjEwNS0uODk1LTItMi0ycy0yIC44OTUtMiAydjRjMCAxLjEwNS44OTUgMiAyIDJzMi0uODk1IDItMnYtNHoiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==')] opacity-20"></div>
        </div>

        <div className="max-w-screen-xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-['Exo_2'] mb-10 pb-4 px-4 sm:px-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Discover Hackathons Worldwide — Plan Your Next Coding Adventure
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Search an interactive global hackathon map by city, date, and topic. Find tech events, join developer communities, and combine travel with hands-on coding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/" aria-label="Open hackathon map">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                <MapPin className="h-5 w-5" />
                Explore the Hackathon Map
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-lg px-8 py-6"
              onClick={scrollToPromotion}
              aria-label="List your hackathon for developers"
            >
              List Your Hackathon
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-screen-xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-['Exo_2']">
            Why Our Hackathon Map?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Global Hackathon Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Find events in your dream destinations across all continents. From <strong>Silicon Valley</strong>, <strong>Berlin</strong> to <strong>Singapore</strong>, discover hackathons wherever you want to travel.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-card border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <MapPin className="h-12 w-12 text-secondary mb-4" />
                <CardTitle className="text-2xl">Travel Planning Made Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Coordinate coding events with vacation plans. Plan your trip around hackathons and explore new cities while building amazing projects.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-card border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-2xl">Connect with Developer Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Meet coders worldwide and build lasting connections. Network with developers from different cultures and backgrounds at international events.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-2xl font-semibold text-primary mb-6">
            Trusted by 10,000+ developers worldwide
          </p>
          <Card className="max-w-2xl mx-auto glass-card">
            <CardContent className="pt-6">
              <p className="text-lg italic text-muted-foreground mb-4">
                "Found my perfect coding retreat in Bali! Hackamaps made it so easy to discover amazing hackathons while planning my digital nomad journey."
              </p>
              <p className="font-semibold">— Sarah Chen, Full-Stack Developer</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hackathon Promotion Section */}
      <section id="promotion" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Exo_2']">
              Get Your Hackathon Noticed by Traveling Developers and Indie Hackers
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Reach a global audience of developers who are actively planning their next coding adventure and indie hackers who are looking for new projects to work on.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              "Reach 50,000+ monthly developer travelers",
              "Featured placement on our interactive map",
              "Priority listing in search results",
              "Social media promotion to our community"
            ].map((feature, idx) => (
              <Card key={idx} className="glass-card">
                <CardContent className="pt-6 flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-base">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Comparison Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[768px]">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-6"></div>
                <Card className="glass-card border-2 hover:border-muted-foreground/50 transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl mb-2">Basic</CardTitle>
                    <div className="text-4xl font-bold">Free</div>
                  </CardHeader>
                </Card>
                <Card className="glass-card border-2 border-primary shadow-lg relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </span>
                  </div>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl mb-2">Featured</CardTitle>
                    <div className="text-4xl font-bold">
                      $20<span className="text-lg text-muted-foreground">/mo</span>
                    </div>
                  </CardHeader>
                </Card>
                <Card className="glass-card border-2 hover:border-secondary/50 transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl mb-2">Premium</CardTitle>
                    <div className="text-4xl font-bold">
                      $99<span className="text-lg text-muted-foreground">/mo</span>
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Features Comparison */}
              {[
                { feature: "Map pin visibility", free: "Basic", featured: "Highlighted", premium: "Premium" },
                { feature: "Event details page", free: true, featured: true, premium: true },
                { feature: "Category filtering", free: true, featured: true, premium: true },
                { feature: "Top of search results", free: false, featured: true, premium: true },
                { feature: "Enhanced event page", free: false, featured: true, premium: true },
                { feature: "Analytics dashboard", free: false, featured: true, premium: true },
                { feature: "Social media promotion", free: false, featured: false, premium: true },
                { feature: "Newsletter feature", free: false, featured: false, premium: true },
                { feature: "Dedicated support", free: false, featured: false, premium: true },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 items-center py-4 border-t border-border">
                  <div className="font-medium px-6">{row.feature}</div>
                  <div className="flex justify-center">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <Check className="h-5 w-5 text-primary" /> : <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="text-sm">{row.free}</span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {typeof row.featured === 'boolean' ? (
                      row.featured ? <Check className="h-5 w-5 text-primary" /> : <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="text-sm">{row.featured}</span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {typeof row.premium === 'boolean' ? (
                      row.premium ? <Check className="h-5 w-5 text-primary" /> : <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="text-sm">{row.premium}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* CTA Buttons */}
              <div className="grid grid-cols-4 gap-4 mt-8">
                <div className="p-6"></div>
                <div className="flex justify-center">
                  <Button variant="outline" size="lg" className="w-full max-w-[200px]">
                    Select Plan
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button size="lg" className="w-full max-w-[200px]">
                    Select Plan
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button variant="secondary" size="lg" className="w-full max-w-[200px]">
                    Select Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/30">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 Hackamaps.com - Plan Your Coding Adventures Worldwide
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
