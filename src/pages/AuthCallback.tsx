import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase handles the hash/query parameters automatically 
        // to establish the session. We just need to check if it succeeded.
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error during auth callback:", error.message);
          navigate("/auth");
          return;
        }

        if (session) {
          // Redirect to the private profile or home
          navigate("/profile-wiecen-private");
        } else {
          // If no session, go back to login
          navigate("/auth");
        }
      } catch (err) {
        console.error("Unexpected error during auth callback:", err);
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Completing login...</h2>
        <p className="text-muted-foreground">Please wait while we set up your session.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
