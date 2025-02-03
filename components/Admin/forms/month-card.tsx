import React, { useEffect, useRef } from 'react';
import '@splidejs/splide/css';
import { Splide, SplideSlide } from '@splidejs/react-splide';

interface MonthCardProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  year:number;
}

function MonthCard({ label, isActive, onClick, year }: MonthCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card relative cursor-pointer transition-all duration-300 p-6 rounded-2xl bg-secondary-bg
        hover:-translate-y-1 group overflow-hidden
        ${isActive ? 'shadow-lg ring-2 ring-accent' : 'shadow hover:shadow-lg'}`}
    >
      {/* Gradient bar on hover */}
      <div 
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/80
          transform origin-left transition-transform duration-300
          ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
      />
      
      <div className="relative text-center">
        {/* Month Label */}
        <div className={`text-lg font-semibold transition-colors duration-200
          ${isActive ? 'text-accent' : 'text-gray-800 group-hover:text-accent'}`}>
          {label}
        </div>

        {/* Year Below the Label */}
        <div className="text-sm text-gray-500 mt-1">
          {year}
        </div>
      </div>
    </div>
  );
}


interface MonthCardSplineProps {
  activeMonth: number;
  onMonthChange: (index: number) => void;
  year:number;
}

export default function MonthCardSpline({ activeMonth, onMonthChange,year }: MonthCardSplineProps) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const splideRef = useRef<any>(null);

  useEffect(() => {
    if (splideRef.current) {
      // Go to active slide without animation on mount
      splideRef.current.go(activeMonth);
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
          start: activeMonth,
          padding: '1rem',
          breakpoints: {
            1024: { perPage: 4 },
            768: { perPage: 3 },
            640: { perPage: 2 },
            480: { perPage: 1 }
          }
        }}
        className="month-splide"
      >
        {months.map((month, index) => (
          <SplideSlide key={month} className="p-2">
            <MonthCard
              year={year}
              label={month}
              isActive={activeMonth === index}
              onClick={() => {
                onMonthChange(index);
                if (splideRef.current) {
                  splideRef.current.go(index);
                }
              }}
            />
          </SplideSlide>
        ))}
      </Splide>

      {/* Custom styles for Splide */}
      <style jsx global>{`
        .month-splide .splide__arrow {
          background: white;
          opacity: 1;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .month-splide .splide__arrow:hover {
          background: var(--accent);
          color: white;
        }
        
        .month-splide .splide__pagination__page {
          background: #d1d5db;
          transition: all 0.3s ease;
        }
        
        .month-splide .splide__pagination__page.is-active {
          background: var(--accent);
          transform: scale(1.2);
        }

        .month-splide .splide__arrow svg {
          fill: currentColor;
        }

        .month-splide .splide__track {
          padding: 1rem 0;
        }
      `}</style>
    </div>
  );
}