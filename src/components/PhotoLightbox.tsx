import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: string;
}

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoLightbox = ({ photos, currentIndex, isOpen, onClose }: PhotoLightboxProps) => {
  const [current, setCurrent] = useState(currentIndex);

  useEffect(() => {
    setCurrent(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          setCurrent((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
          break;
        case "ArrowRight":
          setCurrent((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, photos.length, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !photos[current]) return null;

  const photo = photos[current];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
      >
        <X size={24} />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div className="relative max-w-7xl max-h-[90vh] mx-4">
        <img
          src={photo.src}
          alt={photo.title}
          className="max-w-full max-h-full object-contain"
        />
        
        {(photo.title || photo.caption) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            {photo.title && (
              <h3 className="text-white text-lg font-medium mb-1">{photo.title}</h3>
            )}
            {photo.caption && (
              <p className="text-white/80 text-sm">{photo.caption}</p>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {current + 1} / {photos.length}
      </div>
    </div>
  );
};

export default PhotoLightbox;