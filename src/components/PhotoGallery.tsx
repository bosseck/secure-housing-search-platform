"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

export default function PhotoGallery({
  photos,
  title,
}: {
  photos: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-line bg-moss/50 text-ink/40">
        <Camera size={28} className="mr-2" /> Photos en cours de contrôle
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-72 overflow-hidden rounded-xl border border-line sm:h-[26rem]">
        <Image
          key={active}
          src={photos[active]}
          alt={`${title} — photo ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-pine-deep/85 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {active + 1} / {photos.length} · photos contrôlées
        </span>
      </div>
      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <button
              key={p + i}
              onClick={() => setActive(i)}
              className={`relative h-20 overflow-hidden rounded-lg border-2 transition ${
                i === active
                  ? "border-pine shadow-md"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              <Image src={p} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}