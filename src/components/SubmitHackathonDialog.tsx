import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "AI/ML",
  "Web3/Blockchain",
  "Healthcare",
  "Climate Tech",
  "FinTech",
  "Gaming",
  "Education",
  "Social Impact",
  "DateTime",
  "Open Theme",
];

export function SubmitHackathonDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    categories: [] as string[],
    websiteUrl: "",
    prizePool: "",
    contactEmail: "",
    isOnline: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.location || !formData.startDate || !formData.endDate || !formData.contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.categories.length === 0) {
      toast({
        title: "Missing Categories",
        description: "Please select at least one category.",
        variant: "destructive",
      });
      return;
    }

    // Format email content
    const emailBody = `
New Hackathon Submission

Name: ${formData.name}
Description: ${formData.description}
Location: ${formData.location}
Online: ${formData.isOnline ? "Yes" : "No"}
Start Date: ${formData.startDate}
End Date: ${formData.endDate}
Categories: ${formData.categories.join(", ")}
Website: ${formData.websiteUrl || "N/A"}
Prize Pool: ${formData.prizePool || "N/A"}

Contact Email: ${formData.contactEmail}
    `.trim();

    console.log("Hackathon submission:", emailBody);

    toast({
      title: "Submission Received!",
      description: "Thank you! We'll review your hackathon and add it to the map soon.",
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      categories: [],
      websiteUrl: "",
      prizePool: "",
      contactEmail: "",
      isOnline: false,
    });
    setOpen(false);
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Submit Hackathon</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Hackathon</DialogTitle>
          <DialogDescription>
            Fill in the details below and we'll add your hackathon to the map after review.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Hackathon Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="AI Innovation Summit 2025"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your hackathon..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                required
              />
            </div>

            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOnline"
                  checked={formData.isOnline}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isOnline: checked as boolean })
                  }
                />
                <Label htmlFor="isOnline" className="cursor-pointer">
                  This is an online event
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizePool">Prize Pool</Label>
              <Input
                id="prizePool"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                placeholder="$50,000"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactEmail">Your Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label>Categories * (Select at least one)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={formData.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label
                      htmlFor={`cat-${category}`}
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit for Review</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
