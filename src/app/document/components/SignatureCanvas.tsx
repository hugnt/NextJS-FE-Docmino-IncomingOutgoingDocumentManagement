/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import type React from "react"

interface SignatureCanvasProps {
  onSignatureChange: (signatureFile: File | null) => void
  className?: string
  width?: number
  height?: number
}

const INK_COLORS = [
  { name: "Đen", value: "#000000" },
  { name: "Xanh dương", value: "#0066CC" },
  { name: "Xanh lá", value: "#009900" },
  { name: "Đỏ", value: "#CC0000" },
  { name: "Tím", value: "#6600CC" },
]

export default function SignatureCanvas({
  onSignatureChange,
  className = "",
  width = 300,
  height = 150,
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#000000")

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas background to white
    // ctx.fillStyle = "transparent"
    // ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set drawing styles
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = selectedColor
  }, [selectedColor])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    ctx.strokeStyle = selectedColor
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()

    if (!hasDrawn) {
      setHasDrawn(true)
    }
  }

  const stopDrawing = () => {
    if (!isDrawing) return

    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return

    // Convert canvas to blob and create File
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `signature-${Date.now()}.png`, {
          type: "image/png",
        })
        onSignatureChange(file)
      }
    }, "image/png")
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear and reset canvas
    // ctx.fillStyle = "white"
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    setHasDrawn(false)
    onSignatureChange(null)
  }

  // Touch events for mobile support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    })

    startDrawing(mouseEvent as any)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    })

    draw(mouseEvent as any)
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    stopDrawing()
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Color picker */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-700">Màu mực:</p>
        <div className="flex gap-2 flex-wrap">
          {INK_COLORS.map((color) => (
            <button
              key={color.value}
              className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.value
                  ? "border-gray-400 scale-110 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
                }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setSelectedColor(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="border rounded-md p-2">
        <div className="bg-gray-50 rounded-md border border-dashed relative">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-sm text-gray-400">Vẽ chữ ký của bạn ở đây</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {hasDrawn ? `Đã vẽ xong (${INK_COLORS.find((c) => c.value === selectedColor)?.name})` : "Bắt đầu vẽ chữ ký"}
          </p>
          <Button variant="outline" size="sm" onClick={clearCanvas} disabled={!hasDrawn}>
            Xóa
          </Button>
        </div>
      </div>
    </div>
  )
}
