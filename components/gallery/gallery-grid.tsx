"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
};

const defaultGalleryImages: GalleryImage[] = Array.from(
  { length: 30 },
  (_, index) => {
    const number = index + 1;
    const filename = `image (${number}).jpg`;

    return {
      src: encodeURI(`/gallery/${filename}`),
      alt: `Epoxid art gallery image ${number}`,
    };
  },
);

export default function GalleryGrid() {
  const [galleryImages, setGalleryImages] =
    useState<GalleryImage[]>(defaultGalleryImages);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedImage =
    selectedImageIndex === null ? null : galleryImages[selectedImageIndex];

  useEffect(() => {
    const loadGalleryImages = async () => {
      const response = await fetch("/api/upload");

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (Array.isArray(data.images) && data.images.length > 0) {
        setGalleryImages(data.images);
      }
    };

    loadGalleryImages();
  }, []);

  const openLightbox = (index: number) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    setIsClosing(false);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setSelectedImageIndex(null);
      setIsClosing(false);
    }, 180);
  };

  const showPreviousImage = useCallback(() => {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    });
  }, [galleryImages.length]);

  const showNextImage = useCallback(() => {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    });
  }, [galleryImages.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [selectedImageIndex, showNextImage, showPreviousImage]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {galleryImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className="theme-color animate-gallery-card-in group relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[var(--color-card)] text-left transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
            style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}
            onClick={() => openLightbox(index)}
            aria-label={`Open ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-200 ease-out group-hover:scale-[1.03] group-hover:brightness-95"
              loading="lazy"
            />
            <span className="pointer-events-none absolute inset-0 bg-transparent opacity-0" />
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.9)] p-6 sm:p-10 ${
            isClosing ? "animate-lightbox-out" : "animate-lightbox-in"
          }`}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
        >
          <div
            className="relative h-[84vh] w-[90vw] max-w-[90%] sm:h-[86vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              sizes="90vw"
              className="rounded-[12px] object-contain"
            />
          </div>
          <button
            type="button"
            className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[#ffffff] text-3xl leading-none text-[#111111] opacity-70 transition duration-200 ease-out hover:scale-105 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff] sm:left-6 sm:size-12"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
            }}
            aria-label="Show previous image"
          >
            &lsaquo;
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[#ffffff] text-3xl leading-none text-[#111111] opacity-70 transition duration-200 ease-out hover:scale-105 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff] sm:right-6 sm:size-12"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
            aria-label="Show next image"
          >
            &rsaquo;
          </button>
          <button
            type="button"
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-[#ffffff] text-2xl leading-none text-[#111111] opacity-70 transition duration-200 ease-out hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff] sm:right-6 sm:top-6"
            onClick={closeLightbox}
            aria-label="Close image preview"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
