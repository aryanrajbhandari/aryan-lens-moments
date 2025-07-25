import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-gradient">
            Say Hi
          </h1>
          <p className="text-lg text-muted-foreground">
            Leave feedback or just say hi — I'd love to hear your thoughts.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-secondary rounded-full">
              <Mail size={24} className="text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full min-h-[120px] resize-none"
                placeholder="Your message..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full group"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send size={16} className="mr-2 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            This site isn't for selling or bookings—just a place to share my journey and connect with fellow photography enthusiasts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;