import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink, Plus } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { AuthDialog } from "./AuthDialog";

interface SubmitHackathonDialogProps {
  user: User | null;
}

export function SubmitHackathonDialog({ user }: SubmitHackathonDialogProps) {
  const [open, setOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      setAuthDialogOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleRedirect = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSf94pHc2lmCIOXPU9GDmFbWTL5WD4Z766l-JsEB8pmVgQP_Ww/viewform?usp=dialog", "_blank");
  };

  return (
    <>
      <Button className="gap-2" onClick={handleClick}>
        <Plus className="h-4 w-4" />
        <span className="hidden md:inline">Submit Hackathon</span>
      </Button>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit a Hackathon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
            Click the button below to fill out our submission form. Your hackathon will be reviewed and added to the map shortly after approval.
            </label>

          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleRedirect}
              className="gap-2"
            >
              Go to Website
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
