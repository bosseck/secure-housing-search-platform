import { MapPin } from "lucide-react";

/**
 * Carte stylisée affichant une ZONE approximative (rayon ~500 m),
 * jamais l'adresse exacte — protection des locataires et propriétaires.
 */
export default function ZoneMap({
  city,
  district,
  seed,
}: {
  city: string;
  district: string;
  seed: number;
}) {
  // Générateur déterministe pour varier le tracé des rues selon l'annonce
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const streets = Array.from({ length: 7 }, (_, i) => ({
    x1: rand() * 400,
    y1: i * 42 + rand() * 20,
    x2: rand() * 400,
    y2: i * 42 + rand() * 40,
    w: 1 + rand() * 2,
  }));
  const vStreets = Array.from({ length: 6 }, (_, i) => ({
    x: i * 70 + rand() * 30,
    bend: rand() * 60 - 30,
  }));
  const blocks = Array.from({ length: 10 }, () => ({
    x: rand() * 360,
    y: rand() * 240,
    w: 18 + rand() * 34,
    h: 14 + rand() * 24,
  }));

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-moss/60">
      <svg viewBox="0 0 400 280" className="block w-full" role="img" aria-label={`Zone approximative : ${district}, ${city}`}>
        <rect width="400" height="280" fill="#e7ede3" />
        {/* pâtés de maisons */}
        {blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="3"
            fill="#d3ddcc"
          />
        ))}
        {/* rivière */}
        <path
          d={`M -10 ${200 + (seed % 40)} C 120 ${150 + (seed % 60)}, 260 ${240 - (seed % 50)}, 410 ${180 + (seed % 30)}`}
          stroke="#bcd3cf"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        {/* rues */}
        {streets.map((st, i) => (
          <line
            key={i}
            x1={st.x1 - 200}
            y1={st.y1}
            x2={st.x2 + 220}
            y2={st.y2}
            stroke="#f6f7f2"
            strokeWidth={st.w * 2.4}
          />
        ))}
        {vStreets.map((st, i) => (
          <path
            key={i}
            d={`M ${st.x} -10 Q ${st.x + st.bend} 140 ${st.x} 290`}
            stroke="#f6f7f2"
            strokeWidth="4"
            fill="none"
          />
        ))}
        {/* zone approximative */}
        <circle cx="200" cy="140" r="86" fill="#17573f" opacity="0.12" />
        <circle
          cx="200"
          cy="140"
          r="86"
          fill="none"
          stroke="#17573f"
          strokeWidth="2.5"
          strokeDasharray="10 7"
          className="map-zone-ring"
        />
        <circle cx="200" cy="140" r="7" fill="#17573f" />
        <circle cx="200" cy="140" r="13" fill="none" stroke="#17573f" strokeWidth="2" opacity="0.5" />
      </svg>
      <div className="flex items-center gap-2 border-t border-line bg-card px-4 py-3 text-sm">
        <MapPin size={15} className="shrink-0 text-pine" />
        <span className="font-medium">{district}, {city}</span>
        <span className="ml-auto rounded-full bg-moss px-2.5 py-0.5 text-[11px] font-semibold text-pine">
          Zone ~500 m
        </span>
      </div>
    </div>
  );
}