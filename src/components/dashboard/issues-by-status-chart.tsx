"use client"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { StatusBreakdown } from "@/types/dashboard.types"

interface IssuesByStatusChartProps {
  data: StatusBreakdown[]
}

export function IssuesByStatusChart({ data }: IssuesByStatusChartProps) {
  const filtered = data.filter((d) => d.count > 0)
  if (filtered.length === 0) {
    return <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">No data yet</div>
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={filtered} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={70} paddingAngle={2}>
          {filtered.map((entry) => (
            <Cell key={entry.status} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => [v, "Issues"]} />
        <Legend iconSize={10} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  )
}
