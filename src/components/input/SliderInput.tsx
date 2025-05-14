"use client"

import React, { useState } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    min: number
    max: number
    step?: number
    value?: [number, number]
    onValueChange?: (value: [number, number]) => void
    formatLabel?: (value: number) => string
    className?: string
}

const SliderInput = React.forwardRef<HTMLSpanElement, SliderProps>(
    ({ className, min, max, step = 1, value, onValueChange, formatLabel, ...props }, ref) => {
        const initialValue: [number, number] = Array.isArray(value) ? value : [min, max]
        const [localValues, setLocalValues] = useState<[number, number]>(initialValue)
        // Remove the hoveredThumb state variable:
        // const [hoveredThumb, setHoveredThumb] = useState<number | null>(null)

        const handleValueChange = (newValues: number[]) => {
            const newRange: [number, number] = [newValues[0], newValues[1]]
            setLocalValues(newRange)
            onValueChange?.(newRange)
        }

        return (
            <div className="relative pt-0 pb-2">
                {/* Min and max labels */}
                {/* <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{formatLabel ? formatLabel(min) : min}</span>
                    <span>{formatLabel ? formatLabel(max) : max}</span>
                </div> */}

                {/* Current values display */}
                <div className="flex justify-between mb-4">
                    <div className="text-sm font-medium">{formatLabel ? formatLabel(localValues[0]) : localValues[0]}</div>
                    <div className="text-sm font-medium">{formatLabel ? formatLabel(localValues[1]) : localValues[1]}</div>
                </div>

                <SliderPrimitive.Root
                    ref={ref}
                    min={min}
                    max={max}
                    step={step}
                    value={localValues}
                    onValueChange={handleValueChange}
                    className={cn("relative flex w-full touch-none select-none items-center", className)}
                    {...props}
                >
                    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <SliderPrimitive.Range className="absolute h-full bg-primary" />
                    </SliderPrimitive.Track>

                    {localValues.map((_, idx) => (
                        <SliderPrimitive.Thumb
                            key={idx}
                            className="block h-5 w-5 rounded-full border-2 border-primary bg-white shadow-md transition-all hover:h-6 hover:w-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-900 dark:border-primary dark:focus:ring-offset-gray-900"
                            aria-label={idx === 0 ? "Minimum value" : "Maximum value"}
                        />
                    ))}
                </SliderPrimitive.Root>

                {/* Tick marks (optional) */}
                <div className="flex justify-between mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-0.5 h-1 bg-gray-300 dark:bg-gray-600"
                            style={{
                                visibility: i === 0 || i === 4 ? "hidden" : "visible",
                            }}
                        />
                    ))}
                </div>
            </div>
        )
    },
)

SliderInput.displayName = "SliderInput"

export { SliderInput }
