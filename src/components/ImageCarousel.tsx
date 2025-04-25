
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  image: string;
  heading: string;
  description: string;
}

const carouselItems: CarouselItem[] = [
  {
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    heading: "Help Animals in Need",
    description: "Report injured or stray animals to get them the care they deserve."
  },
  {
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    heading: "Connect with Local NGOs",
    description: "We connect animal reports with nearby rescue organizations."
  },
  {
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    heading: "Make a Difference",
    description: "Your quick action can save an animal's life."
  }
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Images */}
      {carouselItems.map((item, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-custom text-center text-white px-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-slide-in">
                {item.heading}
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6 animate-fade-in">
                {item.description}
              </p>
              <Button 
                asChild 
                className="bg-primary hover:bg-primary-dark text-white animate-fade-in"
              >
                <a href="/report">Report an Animal</a>
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation arrows */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={goToPrevious}
      >
        <ChevronLeft size={24} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={goToNext}
      >
        <ChevronRight size={24} />
      </Button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
