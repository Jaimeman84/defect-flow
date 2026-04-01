interface LabelChipProps {
  name: string
  color: string
}

export function LabelChip({ name, color }: LabelChipProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  )
}
