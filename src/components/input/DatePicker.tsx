"use client"

import { useEffect } from "react"
import { format, parse } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { vi } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  disabled?: boolean | ((date: Date) => boolean)
  className?: string
  displayFormat?: string
  defaultToday?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className,
  displayFormat = "dd/MM/yyyy",
  defaultToday = true,
}: DatePickerProps) {
  // Set today as default if defaultToday is true and no value is provided
  useEffect(() => {
    if (defaultToday && !value) {
      const today = new Date()
      onChange?.(format(today, "yyyy-MM-dd"))
    }
  }, [defaultToday, value, onChange])

  // Convert the YYYY-MM-dd string to a Date object for the calendar
  const date = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined

  // Handle date selection from the calendar
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Convert the Date back to YYYY-MM-dd string format
      onChange?.(format(selectedDate, "yyyy-MM-dd"))
    } else {
      onChange?.("")
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full pl-3 text-left font-normal", !date && "text-muted-foreground", className)}
        >
          {date ? format(date, displayFormat, { locale: vi }) : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleSelect} disabled={disabled} initialFocus locale={vi} />
      </PopoverContent>
    </Popover>
  )
}
