"use client"

import type React from "react"

import { useState, useRef, useEffect, memo } from "react"
import { ZoomIn, ZoomOut, Move, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface InteractiveAsciiPreviewProps {
  asciiArt: string
  colored: boolean
  originalFileName?: string | null
}

// Memoize the component to prevent unnecessary re-renders
export const InteractiveAsciiPreview = memo(function InteractiveAsciiPreview({
  asciiArt,
  colored,
  originalFileName,
}: InteractiveAsciiPreviewProps) {
  const { toast } = useToast()
  const isMobile = useMobile()
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Use refs for values that don't need to trigger re-renders
  const zoomRef = useRef(zoom)
  const positionRef = useRef(position)

  // Update refs when state changes
  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  useEffect(() => {
    positionRef.current = position
  }, [position])

  // Reset position when ASCII art changes
  useEffect(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [asciiArt])

  // Handle pinch-to-zoom gesture with optimized event handling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let initialDistance = 0
    let initialZoom = 1
    let touchStartTime = 0
    let lastTouchTime = 0
    const DOUBLE_TAP_DELAY = 300 // ms

    // Throttle function to limit execution frequency
    const throttle = (callback: Function, limit: number) => {
      let waiting = false
      return function (this: any, ...args: any[]) {
        if (!waiting) {
          callback.apply(this, args)
          waiting = true
          setTimeout(() => {
            waiting = false
          }, limit)
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const now = Date.now()

      // Detect double tap for reset
      if (now - touchStartTime < DOUBLE_TAP_DELAY && e.touches.length === 1) {
        e.preventDefault()
        setZoom(1)
        setPosition({ x: 0, y: 0 })
      }

      touchStartTime = now

      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
        initialZoom = zoomRef.current
      } else if (e.touches.length === 1) {
        setIsDragging(true)
        setDragStart({
          x: e.touches[0].clientX - positionRef.current.x,
          y: e.touches[0].clientY - positionRef.current.y,
        })
      }
    }

    // Throttled touch move handler for better performance
    const handleTouchMove = throttle((e: TouchEvent) => {
      lastTouchTime = Date.now()

      if (e.touches.length === 2) {
        e.preventDefault() // Prevent page scrolling

        // Calculate new distance
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )

        // Calculate zoom factor
        const scale = currentDistance / initialDistance
        const newZoom = Math.min(Math.max(initialZoom * scale, 0.5), 3)

        setZoom(newZoom)
      } else if (e.touches.length === 1 && isDragging) {
        // Handle single touch drag
        const touch = e.touches[0]
        setPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        })
      }
    }, 16) // ~60fps

    const handleTouchEnd = () => {
      // Only reset if it wasn't a quick tap (to avoid conflicts with click events)
      if (Date.now() - lastTouchTime > 100) {
        setIsDragging(false)
        initialDistance = 0
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove as any, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove as any)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
    }
  }

  // Throttled mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      requestAnimationFrame(() => {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      requestAnimationFrame(() => {
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        })
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Optimized wheel handler with debounce
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()

    // Use requestAnimationFrame for smoother zooming
    requestAnimationFrame(() => {
      if (e.deltaY < 0) {
        setZoom((prev) => Math.min(prev + 0.1, 3))
      } else {
        setZoom((prev) => Math.max(prev - 0.1, 0.5))
      }
    })
  }

  if (!asciiArt) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                  <span className="sr-only">Zoom Out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-24 sm:w-32">
            <Slider value={[zoom]} min={0.5} max={3} step={0.1} onValueChange={(value) => setZoom(value[0])} />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                  <span className="sr-only">Zoom In</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">{Math.round(zoom * 100)}%</span>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="sr-only">Reset View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Move className="h-3 w-3" />
            <span>Drag to pan</span>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 relative">
        <div
          className="relative w-full h-[400px] overflow-hidden bg-white dark:bg-gray-900 cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          ref={containerRef}
        >
          <div
            className="absolute transition-transform duration-100 origin-center interactive-preview-content"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: "center",
              willChange: isDragging ? "transform" : "auto", // Optimize rendering
            }}
            ref={contentRef}
          >
            <div
              className="p-4 font-mono text-xs ascii-content"
              style={{ lineHeight: "1.2", letterSpacing: "0", whiteSpace: "pre" }}
            >
              {colored ? <div dangerouslySetInnerHTML={{ __html: asciiArt }} /> : <pre>{asciiArt}</pre>}
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
        <p className="sm:hidden">Pinch to zoom, drag to pan, double-tap to reset</p>
      </div>
    </div>
  )
})

// Default export for dynamic import
export default { InteractiveAsciiPreview }
