import { Card } from "../../ui/card"
import { StatsCard } from "../../Admin/stats-card"
import {StatsCardGroupProps} from "@/types"
import { Key } from "react"


export default function StatsCardGroup({ stats }: StatsCardGroupProps) {

    return(
        <>
         <div className="grid auto-rows-min gap-4 px-5 md:grid-cols-4">

            {stats.map((stats, index: Key | null | undefined) => (
            <StatsCard key={index} {...stats} className="aspect-video rounded-xl"/>
            ))}

            
          </div>
        </>
    )
    
}