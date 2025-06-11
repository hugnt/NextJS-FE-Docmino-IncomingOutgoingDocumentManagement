"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { format, isAfter } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangePickerProps {
  onApply?: (range: DateRange | undefined) => void
  className?: string
  placeholder?: string
  align?: "center" | "start" | "end" | undefined
  side?: "top" | "bottom" | "left" | "right" | undefined
  from?: Date | string | null
  to?: Date | string | null
}

export function DateRangePicker({
  onApply,
  className,
  placeholder = "Chọn khoảng thời gian",
  align = "start",
  side = "top",
  from,
  to,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [appliedRange, setAppliedRange] = useState<DateRange | undefined>(undefined)
  
  useEffect(() => {
    const parsedFrom = typeof from === "string" ? (from ? new Date(from) : undefined) : from
    const parsedTo = typeof to === "string" ? (to ? new Date(to) : undefined) : to
    setFromDate(parsedFrom ?? undefined)
    setToDate(parsedTo ?? undefined)
    setAppliedRange((parsedFrom ?? parsedTo) ? { from: parsedFrom ?? undefined, to: parsedTo ?? undefined } : undefined)
  }, [from, to])
  
  // Handle date selection
  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (!fromDate) {
        console.log("Setting from date:", date)
        setFromDate(date)
      } else if (!toDate && date && isAfter(date, fromDate)) {
        console.log("Setting to date:", date)
        setToDate(date)
      } else {
        console.log("Resetting selection, new from date:", date)
        setToDate(undefined)
        setFromDate(date)
      }
    },
    [fromDate, toDate],
  )


  // Clear the selection
  const handleClear = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation()
      }
      console.log("Clearing date range")
      setFromDate(undefined)
      setToDate(undefined)
      setAppliedRange(undefined)
      onApply?.(undefined)
      setIsOpen(false)
    },
    [onApply],
  )

  // Apply the selected date range
  const handleApply = useCallback(() => {
    if (fromDate) {
      const range = { from: fromDate, to: toDate }
      console.log("Applying date range:", range)
      setAppliedRange(range)
      onApply?.(range)
      setIsOpen(false)
    }
  }, [fromDate, toDate, onApply])

  // Format the display text
  const formatDisplayText = () => {
    if (!appliedRange?.from) return placeholder

    const fromText = appliedRange.from ? format(appliedRange.from, "dd/MM/yyyy") : ""
    const toText = appliedRange.to ? format(appliedRange.to, "dd/MM/yyyy") : ""

    if (fromText && toText) {
      return `${fromText} - ${toText}`
    } else if (fromText) {
      return `Từ ${fromText}`
    }

    return placeholder
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !appliedRange?.from && "text-muted-foreground")}
            onClick={() => setIsOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="flex-1">{formatDisplayText()}</span>
            {appliedRange?.from && (
              <X
                className="h-4 w-4 opacity-70 hover:opacity-100"
                onClick={(e) => handleClear(e)}
                aria-label="Clear date range"
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align} side={side}>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-medium mb-1">Từ ngày</div>
                <div className="p-2 rounded-md border text-center">
                  {fromDate ? format(fromDate, "dd/MM/yyyy") : "Chưa chọn"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Đến ngày</div>
                <div className="p-2 rounded-md border text-center">
                  {toDate ? format(toDate, "dd/MM/yyyy") : "Chưa chọn"}
                </div>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleSelect}
              disabled={(date) => (toDate ? isAfter(date, toDate) : false)}
              initialFocus
            />

            <Separator />

            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => handleClear()} type="button">
                Xóa
              </Button>
              <Button size="sm" onClick={handleApply} disabled={!fromDate} type="button">
                Áp dụng
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
