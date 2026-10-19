"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Attachment = { type: string; url: string };

const SINGLE_MAX_HEIGHT = "max-h-[420px]";
const MULTI_HEIGHT = "h-[280px]";

function imageClass(single: boolean) {
  const size = single
    ? `${SINGLE_MAX_HEIGHT} h-auto w-auto max-w-full`
    : `${MULTI_HEIGHT} w-auto max-w-full`;
  return `block rounded-xl bg-sunken object-contain ${size}`;
}

export function PostImages({
  attachments,
  expandable = false,
  className = "",
}: {
  attachments: Attachment[];
  expandable?: boolean;
  className?: string;
}) {
  const images = attachments.filter((item) => item.type === "image" && item.url);
  const [open, setOpen] = useState<number | null>(null);
  const dragged = useRef(false);
  const startX = useRef(0);
  const single = images.length === 1;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) => {
      setOpen((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  if (!images.length) return null;

  function openAt(index: number) {
    if (!expandable) return;
    setOpen(index);
  }

  return (
    <div className={className}>
      {single ? (
        <Frame
          url={images[0].url}
          label="View image"
          expandable={expandable}
          className={imageClass(true)}
          onOpen={() => openAt(0)}
        />
      ) : (
        <div
          className={`flex ${MULTI_HEIGHT} snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain`}
          onPointerDown={(event) => {
            dragged.current = false;
            startX.current = event.clientX;
          }}
          onPointerMove={(event) => {
            if (Math.abs(event.clientX - startX.current) > 8) dragged.current = true;
          }}
          onClick={(event) => {
            if (!dragged.current) return;
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          {images.map((item, index) => (
            <Frame
              key={`${item.url}-${index}`}
              url={item.url}
              label={`View image ${index + 1} of ${images.length}`}
              expandable={expandable}
              className={imageClass(false)}
              layoutClassName="max-w-full min-w-0 shrink-0 snap-start"
              onOpen={() => openAt(index)}
            />
          ))}
        </div>
      )}
      {open !== null && images[open] ? (
        <Lightbox images={images} index={open} onClose={close} onStep={step} />
      ) : null}
    </div>
  );
}

function Frame({
  url,
  label,
  expandable,
  className,
  layoutClassName = "",
  onOpen,
}: {
  url: string;
  label: string;
  expandable: boolean;
  className: string;
  layoutClassName?: string;
  onOpen: () => void;
}) {
  if (!expandable) {
    return <img src={url} alt="" loading="lazy" decoding="async" className={`${className} ${layoutClassName}`} />;
  }
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen();
      }}
      className={`max-w-full cursor-zoom-in border-0 bg-transparent p-0 ${layoutClassName}`}
    >
      <img src={url} alt="" loading="lazy" decoding="async" className={className} />
    </button>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onStep,
}: {
  images: Attachment[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onStep]);

  const many = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 text-white"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 inline-flex rounded-full bg-white/15 p-2"
      >
        <X size={20} />
      </button>
      {many ? (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(event) => {
            event.stopPropagation();
            onStep(-1);
          }}
          className="absolute top-1/2 left-3 inline-flex -translate-y-1/2 rounded-full bg-white/15 p-2"
        >
          <ChevronLeft size={22} />
        </button>
      ) : null}
      <img
        src={images[index].url}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(event) => event.stopPropagation()}
      />
      {many ? (
        <button
          type="button"
          aria-label="Next image"
          onClick={(event) => {
            event.stopPropagation();
            onStep(1);
          }}
          className="absolute top-1/2 right-3 inline-flex -translate-y-1/2 rounded-full bg-white/15 p-2"
        >
          <ChevronRight size={22} />
        </button>
      ) : null}
      {many ? (
        <p className="absolute bottom-4 text-sm">
          {index + 1} / {images.length}
        </p>
      ) : null}
    </div>
  );
}
