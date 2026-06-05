import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { DotButton, PrevButton, NextButton } from "./EmblaCarouselArrowsDots";
import axios from "axios";

const AUTOPLAY_MS = 5000;

const HeroCarousel = () => {
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [current, setCurrent]     = useState(0);
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth <= 768);
  const timerRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://suela-caramelo-app-back-end.vercel.app/sc/hero-images?isActive=true")
      .then((r) => setAllImages(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const slides = useMemo(() => {
    if (!allImages.length) return [];
    const mobile  = allImages.filter((img) => img.deviceType === "mobile");
    const desktop = allImages.filter((img) => img.deviceType === "desktop");
    let result = isMobile ? mobile : desktop;
    if (!result.length) result = isMobile ? desktop : mobile;
    if (!result.length) result = allImages;
    return result;
  }, [allImages, isMobile]);

  const containerHeight = useMemo(() => {
    if (!slides.length) return 400;
    const max = Math.max(...slides.map((img) => img.targetHeight || 400));
    return isMobile ? Math.min(max, 500) : max;
  }, [slides, isMobile]);

  useEffect(() => { setCurrent(0); }, [slides]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (!slides.length) return;
    timerRef.current = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      AUTOPLAY_MS
    );
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const goTo = (index) => { setCurrent(index); startTimer(); };
  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  if (loading) {
    return (
      <div
        className="w-full flex items-center justify-center bg-zinc-900"
        style={{ height: 300 }}
      >
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div
        className="w-full flex items-center justify-center bg-zinc-900"
        style={{ height: 300 }}
      >
        <p className="text-zinc-400 text-sm">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: containerHeight }}
    >
      {/* Slide track */}
      <div
        className="flex h-full will-change-transform"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(current * 100) / slides.length}%)`,
          transition: "transform 0.5s ease",
        }}
      >
        {slides.map((image, index) => (
          <div
            key={image._id}
            className="relative flex-shrink-0 h-full"
            style={{ width: `${100 / slides.length}%` }}
          >
            <img
              src={image.imageUrl}
              alt={image.name}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              fetchpriority={index === 0 ? "high" : undefined}
            />
            {image.redirectUrl && (
              <a
                href={image.redirectUrl}
                className="absolute inset-0 z-10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={image.name}
              />
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
        <div className="pointer-events-auto"><PrevButton onClick={prev} /></div>
        <div className="pointer-events-auto"><NextButton onClick={next} /></div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
        {slides.map((_, index) => (
          <DotButton
            key={index}
            selected={index === current}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
