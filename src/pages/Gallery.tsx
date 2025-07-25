import { useState, useEffect } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";
import heroImage from "@/assets/hero-nature.jpg";
import nature1 from "@/assets/nature-1.jpg";
import nature2 from "@/assets/nature-2.jpg";
import street1 from "@/assets/street-1.jpg";
import street2 from "@/assets/street-2.jpg";
import portrait1 from "@/assets/portrait-1.jpg";

interface Photo {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: string;
}

const photos: Photo[] = [
  {
    id: "1",
    src: heroImage,
    title: "Misty Forest",
    caption: "Morning fog rolling through ancient pines",
    category: "nature",
  },
  {
    id: "2",
    src: nature1,
    title: "Alpine Reflection",
    caption: "Perfect mirror of snow-capped peaks",
    category: "nature",
  },
  {
    id: "3",
    src: nature2,
    title: "Eagle's Flight",
    caption: "Majestic bird soaring through dramatic skies",
    category: "nature",
  },
  {
    id: "4",
    src: street1,
    title: "Urban Solitude",
    caption: "Lone figure navigating city shadows",
    category: "street",
  },
  {
    id: "5",
    src: street2,
    title: "Geometric Lines",
    caption: "Architecture telling stories through form",
    category: "street",
  },
  {
    id: "6",
    src: portrait1,
    title: "Natural Light",
    caption: "Authentic moment by the window",
    category: "portrait",
  },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const categories = [
    { value: "all", label: "All" },
    { value: "nature", label: "Nature" },
    { value: "street", label: "Street" },
    { value: "portrait", label: "Portrait" },
  ];

  const filteredPhotos = selectedCategory === "all" 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxIndex(-1);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-16 ${isLoaded ? "fade-in-up" : "opacity-0"}`}>
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-gradient">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of moments captured through my lens. Each image tells its own story.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="masonry-grid">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="masonry-item group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-lg bg-card">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto photo-hover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-medium mb-1">{photo.title}</h3>
                    <p className="text-sm text-white/80">{photo.caption}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No photos found in this category.</p>
          </div>
        )}
      </div>

      <PhotoLightbox
        photos={filteredPhotos}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
      />
    </div>
  );
};

export default Gallery;