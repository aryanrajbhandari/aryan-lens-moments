import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-nature.jpg";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>

        <div className={`relative z-10 text-center px-6 ${isLoaded ? "fade-in-up" : "opacity-0"}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-wide">
            Aryan
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
            Through my lens, I try to freeze the moments that usually go unnoticed.
          </p>
        </div>

        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors duration-300 animate-bounce"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-gradient">
            Welcome to my world
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            I'm passionate about capturing the beauty in everyday moments—from the raw energy of street scenes 
            to the serene majesty of nature, and the authentic emotions in portraits. Each photograph tells a 
            story waiting to be discovered.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <h3 className="text-xl font-medium mb-4">Nature</h3>
              <p className="text-muted-foreground">
                Landscapes, wildlife, and the untamed beauty of the natural world.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium mb-4">Street</h3>
              <p className="text-muted-foreground">
                Urban life, candid moments, and the pulse of city streets.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium mb-4">Portrait</h3>
              <p className="text-muted-foreground">
                Human connection, authentic expressions, and personal stories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;