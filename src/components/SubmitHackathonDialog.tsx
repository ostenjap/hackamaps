import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { AuthDialog } from "./AuthDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Link as LinkIcon, Check, X } from "lucide-react";
import { z } from "zod";

interface SubmitHackathonDialogProps {
  user: User | null;
  onSubmitSuccess?: () => void;
}

const hackathonSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(200, "Name must be less than 200 characters"),
  description: z.string().trim().max(5000, "Description must be less than 5000 characters").optional(),
  location: z.string().trim().min(2, "Location must be at least 2 characters").max(200, "Location must be less than 200 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(100, "City must be less than 100 characters"),
  country: z.string().trim().min(2, "Country must be at least 2 characters").max(100, "Country must be less than 100 characters"),
  continent: z.string().trim().min(2, "Continent must be at least 2 characters").max(50, "Continent must be less than 50 characters"),
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  start_date: z.string().datetime("Invalid start date format"),
  end_date: z.string().datetime("Invalid end date format"),
  categories: z.string().trim().min(1, "At least one category is required").max(500, "Categories must be less than 500 characters"),
  website_url: z.union([z.string().url("Invalid URL format"), z.literal("")]).optional(),
  organizer_email: z.union([z.string().email("Invalid email format"), z.literal("")]).optional(),
  max_participants: z.union([z.number().int().positive().max(100000, "Maximum participants must be less than 100,000"), z.null()]).optional(),
  prize_pool: z.string().max(100, "Prize pool must be less than 100 characters").optional(),
  is_online: z.boolean()
}).refine(data => new Date(data.end_date) > new Date(data.start_date), {
  message: "End date must be after start date",
  path: ["end_date"]
});

export function SubmitHackathonDialog({ user, onSubmitSuccess }: SubmitHackathonDialogProps) {
  const [open, setOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  const [extractionError, setExtractionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    city: "",
    country: "",
    continent: "",
    latitude: "",
    longitude: "",
    start_date: "",
    end_date: "",
    categories: "",
    website_url: "",
    prize_pool: "",
    is_online: false,
    max_participants: "",
    organizer_email: user?.email || "",
  });

  const extractCoordinates = (url: string) => {
    // Reset previous results
    setExtractionError('');

    if (!url.trim()) {
      setExtractionError('Please enter a Google Maps URL');
      return;
    }

    // Regular expressions to match different Google Maps URL formats
    const patterns = [
      // Pattern 1: @lat,lng,zoom format
      /@(-?\d+\.\d+),(-?\d+\.\d+),/,

      // Pattern 2: ?q=lat,lng format
      /\?q=(-?\d+\.\d+),(-?\d+\.\d+)/,

      // Pattern 3: /place/.../@lat,lng format
      /place\/[^/]+\/@(-?\d+\.\d+),(-?\d+\.\d+)/,

      // Pattern 4: !3d and !4d format (alternative encoding)
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,

      // Pattern 5: ll=lat,lng format
      /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
    ];

    let match = null;
    let patternIndex = -1;

    // Try each pattern until we find a match
    for (let i = 0; i < patterns.length; i++) {
      match = url.match(patterns[i]);
      if (match) {
        patternIndex = i;
        break;
      }
    }

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      // Validate coordinates
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));
        setExtractionError('');
      } else {
        setExtractionError('Invalid coordinates found in URL');
      }
    } else {
      setExtractionError('No coordinates found in URL. Please make sure it\'s a valid Google Maps link.');
    }
  };

  const handleMapUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMapUrl(url);
    extractCoordinates(url);
  };

  const handleClick = () => {
    if (!user) {
      setAuthDialogOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for validation
      const dataToValidate = {
        name: formData.name,
        description: formData.description || undefined,
        location: formData.location,
        city: formData.city,
        country: formData.country,
        continent: formData.continent,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        start_date: formData.start_date,
        end_date: formData.end_date,
        categories: formData.categories,
        website_url: formData.website_url || undefined,
        organizer_email: formData.organizer_email || undefined,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        prize_pool: formData.prize_pool || undefined,
        is_online: formData.is_online
      };

      // Validate input data
      const validatedData = hackathonSchema.parse(dataToValidate);

      // Insert validated data
      const { error } = await supabase.from("hackathons").insert({
        name: validatedData.name,
        description: validatedData.description || null,
        location: validatedData.location,
        city: validatedData.city,
        country: validatedData.country,
        continent: validatedData.continent,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        start_date: validatedData.start_date,
        end_date: validatedData.end_date,
        categories: validatedData.categories.split(",").map(c => c.trim()),
        website_url: validatedData.website_url || null,
        prize_pool: validatedData.prize_pool || null,
        is_online: validatedData.is_online,
        max_participants: validatedData.max_participants,
        organizer_email: validatedData.organizer_email || null,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Hackathon submitted successfully.",
      });

      setOpen(false);
      setFormData({
        name: "",
        description: "",
        location: "",
        city: "",
        country: "",
        continent: "",
        latitude: "",
        longitude: "",
        start_date: "",
        end_date: "",
        categories: "",
        website_url: "",
        prize_pool: "",
        is_online: false,
        max_participants: "",
        organizer_email: user?.email || "",
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error: any) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to submit hackathon.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button className="gap-2" onClick={handleClick}>
        <Plus className="h-4 w-4" />
        <span className="hidden md:inline">Submit Hackathon</span>
      </Button>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit a Hackathon</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Hackathon Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Convention Center, City"
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="continent">Continent *</Label>
                <Input
                  id="continent"
                  required
                  value={formData.continent}
                  onChange={(e) => setFormData({ ...formData, continent: e.target.value })}
                  placeholder="e.g., Europe, Asia, Africa"
                />
              </div>

              <div>
                <Label htmlFor="google_maps">Google Maps URL *</Label>
                <div className="relative">
                  <Input
                    id="google_maps"
                    type="text"
                    value={mapUrl}
                    onChange={handleMapUrlChange}
                    placeholder="Paste Google Maps link to extract coordinates"
                    className="pr-10"
                  />
                  <MapPin className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {extractionError && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <X className="h-4 w-4 mr-1" /> {extractionError}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="latitude">Latitude </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="e.g., 40.7128"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="e.g., -74.0060"
                />
              </div>

              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="categories">Categories * (comma-separated)</Label>
                <Input
                  id="categories"
                  required
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  placeholder="e.g., AI, Blockchain, Web3"
                />
              </div>

              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="prize_pool">Prize Pool</Label>
                <Input
                  id="prize_pool"
                  value={formData.prize_pool}
                  onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                  placeholder="e.g., $10,000"
                />
              </div>

              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="organizer_email">Organizer Email</Label>
                <Input
                  id="organizer_email"
                  type="email"
                  value={formData.organizer_email}
                  onChange={(e) => setFormData({ ...formData, organizer_email: e.target.value })}
                />
              </div>

              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="is_online"
                  checked={formData.is_online}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_online: checked as boolean })
                  }
                />
                <Label htmlFor="is_online" className="cursor-pointer">
                  This is an online hackathon
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Hackathon"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
