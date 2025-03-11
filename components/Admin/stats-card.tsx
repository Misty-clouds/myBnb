import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: {
    type: string;
    value: string;
  };
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ label, value, trend, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm border-secondary transition-all duration-200 hover:transform hover:scale-105",
          className
        )}
        {...props}
      >
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-sm text-muted-foreground">{label}</h3>
        </div>
        <div className="p-6 pt-0">
          <div className={`flex items-center  gap-2 ${trend ? "justify-between" : "justify-start"}`}>
            <span className="text-2xl font-semibold">{value}</span>
            {trend && (
              <div className={`text-sm block items-center px-6 ${trend.type === "increase" ? "text-green-500" : "text-red-500"}`}>
                {trend.type == "increase" ? 
                <>
                 <TrendingUp size={16} className="ml-1" />
                  {trend.value}%
                </>
                  : 
                  <>
                  {trend.value}%
                  <TrendingDown size={16} className="ml-1" />
                  </>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StatsCard.displayName = "StatsCard";

export { StatsCard };