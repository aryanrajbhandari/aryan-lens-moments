import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-16 ${isLoaded ? "fade-in-up" : "opacity-0"}`}>
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-gradient">
            About Me
          </h1>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="flex items-center justify-center mb-12">
            <div className="p-4 bg-secondary rounded-full">
              <Camera size={48} className="text-primary" />
            </div>
          </div>

          <div className="text-lg leading-relaxed space-y-6 text-muted-foreground">
            <p>
              <strong className="text-foreground">Hey, I'm Aryan.</strong>
            </p>

            <p>
              I always wanted to get into photography — not for likes or followers, just for the feeling it gives. 
              Watching birds fly around used to make me wonder what it would be like to move freely, without rules 
              or borders… just go wherever, capture whatever. That thought stuck with me.
            </p>

            <p>
              Now that I finally got my first camera — a <strong className="text-foreground">Canon EOS 250D</strong> — 
              I've been out exploring, learning, and clicking whenever something catches my eye. I'm mostly into nature, 
              street scenes, and portraits — the kind of photos that don't always shout, but still say something.
            </p>

            <p>
              This site isn't for selling or bookings. It's just a place to collect moments I care about — and maybe, 
              over time, see how far I've come.
            </p>
          </div>

          <div className="mt-16 pt-12 border-t border-border">
            <h3 className="text-2xl font-light mb-8 text-center text-gradient">My Focus</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌲</span>
                </div>
                <h4 className="text-lg font-medium mb-2">Nature</h4>
                <p className="text-sm text-muted-foreground">
                  Finding peace in landscapes, wildlife, and the raw beauty of untouched places.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏙️</span>
                </div>
                <h4 className="text-lg font-medium mb-2">Street</h4>
                <p className="text-sm text-muted-foreground">
                  Capturing the rhythm of urban life and the stories hidden in everyday moments.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <h4 className="text-lg font-medium mb-2">Portrait</h4>
                <p className="text-sm text-muted-foreground">
                  Connecting with people and revealing the authentic expressions that make us human.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;