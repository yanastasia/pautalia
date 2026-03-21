import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartmentCode?: string;
}

export function LeadModal({ open, onOpenChange, apartmentCode }: LeadModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    gdprConsent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onOpenChange(false);
      setFormData({ name: "", email: "", phone: "", message: "", gdprConsent: false });
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {submitted ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <DialogTitle className="text-2xl mb-2">Thank You!</DialogTitle>
            <p className="text-muted-foreground">
              We've received your inquiry and will contact you shortly.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {apartmentCode ? `Inquire about ${apartmentCode}` : "Get in Touch"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground pt-2">
                Fill out the form below and our team will reach out to you within 24 hours.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-input-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="bg-input-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+359 XX XXX XXXX"
                  className="bg-input-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  className="bg-input-background border-border resize-none"
                />
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="gdpr"
                  required
                  checked={formData.gdprConsent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, gdprConsent: checked as boolean })
                  }
                />
                <Label htmlFor="gdpr" className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
                  I agree to the processing of my personal data in accordance with the GDPR 
                  and consent to be contacted regarding this inquiry. *
                </Label>
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                Submit Inquiry
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
