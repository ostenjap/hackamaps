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

export function SubmitHackathonDialog() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleRedirect = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSf94pHc2lmCIOXPU9GDmFbWTL5WD4Z766l-JsEB8pmVgQP_Ww/viewform?usp=dialog", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
        <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Submit Hackathon</span>
        </Button>
      </DialogTrigger>
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
  );
}
