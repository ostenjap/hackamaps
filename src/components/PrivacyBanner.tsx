import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export const PrivacyBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("privacy-accepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacy-accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-muted-foreground">
            <p>
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
              {" · "}
              <Link to="/terms-of-service" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAccept} size="sm">
              Accept
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAccept}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
