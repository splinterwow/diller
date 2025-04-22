
import * as React from "react"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BarChartProps {
  data: any[]
  xAxisKey?: string
  yAxisKey?: string
  className?: string
}

export function BarChart({
  data,
  xAxisKey = "name",
  yAxisKey = "total",
  className,
}: BarChartProps) {
  const config = {
    [yAxisKey]: {
      label: yAxisKey,
      color: "hsl(var(--primary))",
    },
  }

  return (
    <ChartContainer className={className} config={config}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(value) => (`${value}`)}
            />
          }
        />
        <Bar
          dataKey={yAxisKey}
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ChartContainer>
  )
}
