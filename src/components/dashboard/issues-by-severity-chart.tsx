"use client"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"
import type { SeverityBreakdown } from "@/types/dashboard.types"

interface IssuesBySeverityChartProps {
  data: SeverityBreakdown[]
}

export function IssuesBySeverityChart({ data }: IssuesBySeverityChartProps) {
  const filtered = data.filter((d) => d.count > 0)
  if (filtered.length === 0) {
    return <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">No data yet</div>
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={filtered} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {filtered.map((entry) => (
            <Cell key={entry.severity} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
