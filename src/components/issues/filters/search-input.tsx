"use client"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect, useRef, useState } from "react"

interface SearchInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = "Search issues..." }: SearchInputProps) {
  const [local, setLocal] = useState(value)
  const debounced = useDebounce(local, 300)
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange })

  // Only fire when debounced value changes, not when onChange reference changes
  useEffect(() => { onChangeRef.current(debounced) }, [debounced])

  // Only sync external value in if it differs from local (e.g. clear button)
  useEffect(() => { if (value !== local) setLocal(value) }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8 h-9"
      />
      {local && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0.5 top-0.5 h-8 w-8"
          onClick={() => { setLocal(""); onChange("") }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
