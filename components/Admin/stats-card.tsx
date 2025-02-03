import { TrendingUp,TrendingDown, LucideIcon } from 'lucide-react';


interface StatsCardProps {
    label: string
    value: string | number
    trend?: {
      type: "increase" | "decrease"
      value: string
    }
  }


  
  export function StatsCard({ label, value, trend }: StatsCardProps) {
    return (

      <div className="flex flex-col my-5 gap-1 transition-all duration-200 hover:transform hover:scale-105 bg-secondary-bg px-5 py-3 rounded-lg">
        <div className="text-sm text-muted-gray">{label}</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-primary-text">{value}</span>
          {trend && (
            <span className={`text-sm ${trend.type === "increase" ? "text-[#2ec114]" : "text-[#f35162]"}`}>
              {trend.value}%
              <span>
                {
                  trend.type==="increase" ? <TrendingUp size={16} />:<TrendingDown size={16}/>
                }
               
              </span>
            </span>
          )}
        </div>
      </div>
    )
  }
  
