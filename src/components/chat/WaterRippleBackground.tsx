"use client";

import React from "react";

interface WaterRippleBackgroundProps {
  className?: string;
}

export function WaterRippleBackground({ className = "" }: WaterRippleBackgroundProps) {
  // Anneaux concentriques générés avec des rayons précis
  const rippleCenters = [
    {
      id: "drop-1",
      cx: 180,
      cy: 220,
      radii: [18, 42, 75, 118, 172, 235, 310, 395, 490, 595, 710, 835],
      primaryColor: "#0f2744", // Bleu HAS
      accentColor: "#e0521c",  // Orange HAS
    },
    {
      id: "drop-2",
      cx: 820,
      cy: 320,
      radii: [22, 50, 88, 135, 192, 260, 340, 430, 530, 640, 760, 890],
      primaryColor: "#e0521c", // Orange HAS
      accentColor: "#0f2744",  // Bleu HAS
    },
    {
      id: "drop-3",
      cx: 320,
      cy: 780,
      radii: [16, 38, 70, 112, 164, 228, 302, 386, 480, 584, 698],
      primaryColor: "#0f2744",
      accentColor: "#e0521c",
    },
    {
      id: "drop-4",
      cx: 750,
      cy: 820,
      radii: [20, 48, 85, 130, 185, 250, 325, 410, 505, 610],
      primaryColor: "#e0521c",
      accentColor: "#0f2744",
    },
    {
      id: "drop-5",
      cx: 520,
      cy: 110,
      radii: [15, 36, 68, 110, 162, 224, 296, 378, 470],
      primaryColor: "#2563eb",
      accentColor: "#ea580c",
    },
  ];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none bg-white dark:bg-[#0B0F14] transition-colors ${className}`}
      aria-hidden="true"
    >
      {/* Léger voile de brillance propre */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/20 via-white to-orange-50/15 dark:from-slate-900/30 dark:via-[#0B0F14] dark:to-orange-950/20" />

      {/* Rendu SVG des ondulations concentriques de gouttes d'eau */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dégradés fins pour l'impact des gouttes */}
          <radialGradient id="drop-glow-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f2744" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#2563eb" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="drop-glow-orange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0521c" stopOpacity="0.38" />
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {rippleCenters.map((center) => (
          <g key={center.id} className="opacity-95">
            {/* Goutte d'eau centrale (point d'impact) */}
            <circle
              cx={center.cx}
              cy={center.cy}
              r={7}
              fill={center.primaryColor === "#e0521c" ? "url(#drop-glow-orange)" : "url(#drop-glow-blue)"}
            />
            <circle
              cx={center.cx}
              cy={center.cy}
              r={2}
              fill={center.primaryColor}
              fillOpacity={0.65}
            />

            {/* Ondulations concentriques très fines */}
            {center.radii.map((radius, idx) => {
              // Alternance subtile bleu et orange pour un rendu artistique et équilibré
              const isAccent = idx % 3 === 2;
              const color = isAccent ? center.accentColor : center.primaryColor;
              
              // Décroissance douce de l'opacité selon l'éloignement de la goutte
              const baseOpacity = Math.max(0.04, 0.16 - (idx * 0.009));
              const strokeWidth = idx === 0 ? 0.75 : idx % 2 === 0 ? 0.85 : 0.65;

              return (
                <circle
                  key={idx}
                  cx={center.cx}
                  cy={center.cy}
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={baseOpacity}
                  strokeDasharray={idx % 4 === 3 ? "4 3" : undefined}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
        ))}

        {/* Lignes d'interférences subtiles au croisement des vagues */}
        <circle
          cx={500}
          cy={500}
          r={620}
          fill="none"
          stroke="#0f2744"
          strokeWidth={0.5}
          strokeOpacity={0.035}
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={500}
          cy={500}
          r={780}
          fill="none"
          stroke="#e0521c"
          strokeWidth={0.5}
          strokeOpacity={0.035}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
