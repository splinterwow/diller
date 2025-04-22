
import * as React from "react"
import { Cell, Pie, PieChart as RechartsPieChart, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PieChartProps {
  data: any[]
  nameKey?: string
  valueKey?: string
  className?: string
}

export function PieChart({
  data,
  nameKey = "name",
  valueKey = "value",
  className,
}: PieChartProps) {
  // Generate a config object with a unique color for each data segment
  const config = data.reduce((acc, item, index) => {
    const hue = (index * 360) / data.length
    return {
      ...acc,
      [item[nameKey]]: {
        label: item[nameKey],
        color: `hsla(${hue}, 70%, 50%, 1)`,
      },
    }
  }, {})

  // Generate cell colors from the config
  const COLORS = data.map((item) => config[item[nameKey]].color)

  return (
    <ChartContainer className={className} config={config}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey={valueKey}
          nameKey={nameKey}
          label={(entry) => entry[nameKey]}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              nameKey={nameKey}
              labelKey={valueKey}
            />
          }
        />
      </RechartsPieChart>
    </ChartContainer>
  )
}
