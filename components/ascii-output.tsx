"use client"

import { forwardRef, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface AsciiOutputProps {
  asciiArt: string
  colored: boolean
}

export const AsciiOutput = forwardRef<HTMLDivElement, AsciiOutputProps>(({ asciiArt, colored }, ref) => {
  useEffect(() => {
    if (ref && "current" in ref && ref.current) {
      ref.current.scrollTop = 0
    }
  }, [asciiArt, ref])

  if (!asciiArt) {
    return (
      <div className="h-64 flex items-center justify-center border rounded-md bg-gray-50 dark:bg-gray-800 transition-all duration-300 hover:shadow-md">
        <p className="text-gray-500 dark:text-gray-400">No ASCII art generated yet</p>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg h-full">
      <div
        ref={ref}
        className="overflow-auto h-full font-mono text-xs"
        style={{
          lineHeight: "1.2",
          letterSpacing: "0",
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
          padding: "4px", // Minimal padding to avoid cutting off characters
        }}
      >
        {colored ? (
          <div
            dangerouslySetInnerHTML={{ __html: asciiArt }}
            style={{ whiteSpace: "pre", margin: 0 }}
            className="transition-opacity duration-300 hover:opacity-95"
          />
        ) : (
          <pre className="whitespace-pre transition-opacity duration-300 hover:opacity-95 m-0">{asciiArt}</pre>
        )}
      </div>
    </Card>
  )
})

AsciiOutput.displayName = "AsciiOutput"
