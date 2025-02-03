import React, { useEffect, useRef } from 'react';
import '@splidejs/splide/css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: {
    type: "increase" | "decrease";
    value: string;
  };
}

function StatsCard({ label, value, trend }: StatsCardProps) {
  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 p-6 rounded-2xl bg-secondary-bg
        hover:-translate-y-1 group overflow-hidden
        ${trend ? 'shadow-lg ring-2 ring-accent' : 'shadow hover:shadow-lg'}`}
    >
      {/* Gradient bar on hover */}
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/80
          transform origin-left transition-transform duration-300
          ${trend ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
      />

      <div className="relative text-center">
        {/* Label */}
        <div className="text-sm text-muted-gray">{label}</div>

        {/* Value & Trend */}
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-2xl font-semibold text-primary-text">{value}</span>

          {trend && (
            <span className={`text-sm flex items-center gap-1 ${trend.type === "increase" ? "text-[#2ec114]" : "text-[#f35162]"}`}>
              {trend.value}%
              {trend.type === "increase" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatsCardSplineProps {
  stats: StatsCardProps[];
}

export default function StatsCardSpline({ stats }: StatsCardSplineProps) {
  const splideRef = useRef<any>(null);

  useEffect(() => {
    if (splideRef.current) {
      splideRef.current.go(0);
    }
  }, []);

  return (
    <div className="w-full">
      <Splide
        ref={splideRef}
        options={{
          type: 'slide',
          perPage: 4,
          gap: '1rem',
          pagination: true,
          arrows: true,
          padding: '1rem',
          breakpoints: {
            1024: { perPage: 3 },
            768: { perPage: 2 },
            640: { perPage: 1 },
          },
        }}
        className="stats-splide"
      >
        {stats.map((stat, index) => (
          <SplideSlide key={index} className="p-2">
            <StatsCard {...stat} />
          </SplideSlide>
        ))}
      </Splide>

      {/* Custom styles for Splide */}
      <style jsx global>{`
        .stats-splide .splide__arrow {
          background: white;
          opacity: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .stats-splide .splide__arrow:hover {
          background: var(--accent);
          color: white;
        }

        .stats-splide .splide__pagination__page {
          background: #d1d5db;
          transition: all 0.3s ease;
        }

        .stats-splide .splide__pagination__page.is-active {
          background: var(--accent);
          transform: scale(1.2);
        }

        .stats-splide .splide__arrow svg {
          fill: currentColor;
        }

        .stats-splide .splide__track {
          padding: 1rem 0;
        }
      `}</style>
    </div>
  );
}
