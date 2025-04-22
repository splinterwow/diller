
import * as React from "react"
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AreaChartProps {
  data: any[]
  xAxisKey?: string
  yAxisKey?: string
  className?: string
}

export function AreaChart({
  data,
  xAxisKey = "name",
  yAxisKey = "total",
  className,
}: AreaChartProps) {
  const config = {
    [yAxisKey]: {
      label: yAxisKey,
      color: "hsl(var(--primary))",
    },
  }

  return (
    <ChartContainer className={className} config={config}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(value) => (`${value}`)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey={yAxisKey}
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
          activeDot={{ r: 8 }}
        />
      </RechartsAreaChart>
    </ChartContainer>
  )
}
