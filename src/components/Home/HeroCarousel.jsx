import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, PrevButton, NextButton } from "./EmblaCarouselArrowsDots";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

const HeroCarousel = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Detectar si es dispositivo móvil
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Obtener imágenes del backend
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get(
          "https://suela-caramelo-app-back-end.vercel.app/sc/hero-images?isActive=true"
        );
        setHeroImages(response.data);
      } catch (error) {
        console.error("Error fetching hero images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Filtrar imágenes según el dispositivo
  useEffect(() => {
    if (heroImages.length > 0) {
      const deviceSpecificImages = heroImages.filter(
        (image) => image.deviceType === (isMobile ? "mobile" : "desktop")
      );

      // Si no hay imágenes específicas, mostrar todas
      setFilteredImages(
        deviceSpecificImages.length > 0 ? deviceSpecificImages : heroImages
      );
    }
  }, [heroImages, isMobile]);

  // Configurar scroll snaps y listeners
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, filteredImages]);

  const scrollTo = (index) => emblaApi && emblaApi.scrollTo(index);

  // Reiniciar carrusel cuando cambian las imágenes filtradas
  useEffect(() => {
    if (emblaApi && filteredImages.length > 0) {
      emblaApi.reInit();
    }
  }, [emblaApi, filteredImages]);

  if (loading) {
    return (
      <div className="w-full h-64 sm:h-80 md:h-[30rem] flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando imágenes...</div>
      </div>
    );
  }

  if (!filteredImages.length) {
    return (
      <div className="w-full h-64 sm:h-80 md:h-[30rem] flex items-center justify-center bg-gray-900">
        <div className="text-white">
          No hay imágenes disponibles para este dispositivo
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {filteredImages.map((image, index) => (
            <div
              className="embla__slide flex-[0_0_100%] min-w-0 relative"
              key={`${image._id}-${isMobile ? "mobile" : "desktop"}`}
            >
              <div
                className="w-full"
                style={{
                  height: isMobile
                    ? `${Math.min(image.targetHeight, 500)}px` // Limitar altura en móvil
                    : `${image.targetHeight}px`,
                  backgroundColor: "#1a1a1a",
                }}
              >
                <img
                  src={image.imageUrl}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  loading={index > 0 ? "lazy" : "eager"}
                />
                {image.redirectUrl && (
                  <a
                    href={image.redirectUrl}
                    className="absolute inset-0 z-10"
                    aria-label={`Enlace a ${image.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                )}
              </div>

              {/* Texto descriptivo opcional */}
              {image.name && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                  <h2 className="text-white text-xl md:text-3xl font-bold">
                    {image.name}
                  </h2>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 flex justify-between z-20">
        <PrevButton onClick={() => emblaApi && emblaApi.scrollPrev()} />
        <NextButton onClick={() => emblaApi && emblaApi.scrollNext()} />
      </div>

      {/* Puntos de navegación */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
