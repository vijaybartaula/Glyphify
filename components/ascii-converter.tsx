"use client"

import { useState, useCallback, useRef, useEffect, Suspense } from "react"
import {
  Upload,
  Settings,
  Download,
  Share2,
  ImageIcon,
  RefreshCw,
  FileType,
  ImageIcon as ImageIcon2,
  Eye,
  Code,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ImageDropzone } from "./image-dropzone"
import { AsciiOutput } from "./ascii-output"
import dynamic from "next/dynamic"
import { useMobile } from "@/hooks/use-mobile"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import the heavy components
const InteractiveAsciiPreview = dynamic(
  () => import("./interactive-ascii-preview").then((mod) => ({ default: mod.InteractiveAsciiPreview })),
  {
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-md" />
      </div>
    ),
    ssr: false,
  },
)

// Dynamically import the converter function
const { convertToAscii, captureAsciiArtAsImage } = await import("@/lib/ascii-converter")

export function AsciiConverter() {
  const { toast } = useToast()
  const isMobile = useMobile()
  const [image, setImage] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [asciiArt, setAsciiArt] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [resultView, setResultView] = useState<"code" | "interactive">("interactive")
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const asciiOutputRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use a ref for settings to avoid unnecessary re-renders
  const settingsRef = useRef({
    width: 100,
    colored: true,
    inverted: false,
    characterSet: "standard",
  })
  const [settings, setSettings] = useState(settingsRef.current)

  // Update the ref when settings change
  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const characterSets = {
    standard: " .:-=+*#%@",
    detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    blocks: "█▓▒░ ",
    simple: "@%#*+=-:. ",
  }

  // Optimize scroll behavior
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }, [])

  // Scroll to top when tab changes
  useEffect(() => {
    scrollToTop()
  }, [activeTab, scrollToTop])

  // Adjust result container height based on image aspect ratio
  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      // Calculate aspect ratio and set a reasonable height
      const aspectRatio = imageSize.height / imageSize.width
      const baseHeight = isMobile ? 300 : 400
      const calculatedHeight = Math.min(Math.max(baseHeight * aspectRatio, 200), 600)

      // Apply to container if needed
      const containers = document.querySelectorAll(".ascii-result-container") as NodeListOf<HTMLElement>
      containers.forEach((container) => {
        container.style.height = `${calculatedHeight}px`
      })
    }
  }, [imageSize, isMobile, resultView])

  // Optimize image upload with debounce
  const handleImageUpload = useCallback((file: File) => {
    setOriginalFile(file)

    // Use FileReader more efficiently
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string
        setImage(imageUrl)

        // Get image dimensions with optimized image loading
        const img = new Image()
        img.onload = () => {
          setImageSize({
            width: img.width,
            height: img.height,
          })

          // Clean up to prevent memory leaks
          URL.revokeObjectURL(img.src)
        }
        img.src = imageUrl

        setActiveTab("convert")
      }
    }

    // Read as data URL only for smaller images
    if (file.size < 5 * 1024 * 1024) {
      // 5MB limit
      reader.readAsDataURL(file)
    } else {
      // For larger files, use object URL
      const objectUrl = URL.createObjectURL(file)
      setImage(objectUrl)

      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height,
        })
      }
      img.src = objectUrl

      setActiveTab("convert")
    }
  }, [])

  // Optimize conversion with web workers if available
  const handleConvert = useCallback(async () => {
    if (!image) return

    setIsProcessing(true)
    try {
      // Use current settings from ref to avoid closure issues
      const currentSettings = settingsRef.current

      // Small delay to allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 50))

      // Process in chunks for better UI responsiveness
      const result = await convertToAscii(
        image,
        currentSettings.width,
        characterSets[currentSettings.characterSet as keyof typeof characterSets],
        currentSettings.colored,
        currentSettings.inverted,
      )

      setAsciiArt(result)
      setActiveTab("result")

      toast({
        title: "Conversion complete!",
        description: "Your image has been transformed into ASCII art.",
      })
    } catch (error) {
      console.error("Conversion error:", error)
      toast({
        title: "Conversion failed",
        description: "There was an error converting your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [image, characterSets, toast])

  // Optimize text download
  const handleDownloadText = useCallback(() => {
    if (!asciiArt) return

    const plainText = settings.colored ? asciiArt.replace(/<[^>]*>/g, "").replace(/<br\/>/g, "\n") : asciiArt

    // Use Blob more efficiently
    const blob = new Blob([plainText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const element = document.createElement("a")
    element.href = url
    element.download = originalFile ? `${originalFile.name.split(".")[0]}-ascii.txt` : "ascii-art.txt"

    // Append, click, and remove in one animation frame for better performance
    requestAnimationFrame(() => {
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      // Clean up the URL to prevent memory leaks
      URL.revokeObjectURL(url)
    })

    toast({
      title: "Text file downloaded",
      description: "Your ASCII art has been downloaded as a text file.",
    })
  }, [asciiArt, originalFile, settings.colored, toast])

  // Optimize image download to ensure proper dimensions and no extra whitespace
  const handleDownloadImage = useCallback(async () => {
    if (!asciiArt) return

    setIsDownloading(true)
    try {
      let elementToCapture: HTMLElement | null = null

      // First try to find the element based on the current view
      if (resultView === "interactive") {
        // Try multiple selectors to find the content in interactive view
        elementToCapture =
          document.querySelector(".interactive-preview-content") || document.querySelector(".ascii-content")
      } else {
        elementToCapture = asciiOutputRef.current
      }

      // If we still can't find the element, try a more general approach
      if (!elementToCapture) {
        // Look for any element containing the ASCII art
        elementToCapture =
          document.querySelector(".ascii-content") ||
          document.querySelector("pre") ||
          document.querySelector("[dangerouslySetInnerHTML]")?.parentElement
      }

      // Final fallback - just use the container of the current view
      if (!elementToCapture) {
        elementToCapture =
          (document.querySelector(".ascii-result-container")?.firstElementChild as HTMLElement) ||
          (document.querySelector(".card")?.firstElementChild as HTMLElement)

        console.log("Using fallback container for capture")
      }

      if (!elementToCapture) {
        throw new Error("Could not find element to capture")
      }

      // Store original styles
      const originalStyles = {
        maxHeight: elementToCapture.style.maxHeight,
        padding: elementToCapture.style.padding,
        margin: elementToCapture.style.margin,
        overflow: elementToCapture.style.overflow,
        transform: elementToCapture.style.transform,
        scrollTop: elementToCapture.scrollTop || 0,
      }

      // Optimize element for capture
      elementToCapture.style.maxHeight = "none"
      elementToCapture.style.padding = "0"
      elementToCapture.style.margin = "0"
      elementToCapture.style.overflow = "visible"

      // Reset scroll position
      if ("scrollTop" in elementToCapture) {
        elementToCapture.scrollTop = 0
      }

      // If this is the interactive view, ensure we're capturing at the right scale
      if (resultView === "interactive" && elementToCapture.classList.contains("interactive-preview-content")) {
        // Store the original transform
        const originalTransform = elementToCapture.style.transform

        // Set transform to just the scale part for the capture
        if (originalTransform.includes("scale")) {
          const scaleMatch = originalTransform.match(/scale$$([^)]+)$$/)
          if (scaleMatch && scaleMatch[1]) {
            elementToCapture.style.transform = `scale(${scaleMatch[1]})`
          }
        }
      }

      // Small delay to ensure styles are applied
      await new Promise((resolve) => setTimeout(resolve, 50))

      // Use the improved capture method
      const dataUrl = await captureAsciiArtAsImage(elementToCapture)

      // Restore original styles
      elementToCapture.style.maxHeight = originalStyles.maxHeight
      elementToCapture.style.padding = originalStyles.padding
      elementToCapture.style.margin = originalStyles.margin
      elementToCapture.style.overflow = originalStyles.overflow
      elementToCapture.style.transform = originalStyles.transform

      if ("scrollTop" in elementToCapture) {
        elementToCapture.scrollTop = originalStyles.scrollTop
      }

      // Download the image
      const element = document.createElement("a")
      element.href = dataUrl
      element.download = originalFile ? `${originalFile.name.split(".")[0]}-ascii.png` : "ascii-art.png"

      // Append, click, and remove in one animation frame for better performance
      requestAnimationFrame(() => {
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      })

      toast({
        title: "Image downloaded",
        description: "Your ASCII art has been downloaded as a PNG image with original proportions.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "There was an error creating the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }, [asciiArt, originalFile, resultView, toast])

  // Optimize sharing
  const handleShare = useCallback(() => {
    if (!asciiArt) return

    const plainText = settings.colored ? asciiArt.replace(/<[^>]*>/g, "").replace(/<br\/>/g, "\n") : asciiArt

    if (navigator.share) {
      navigator
        .share({
          title: "My ASCII Art from Glyphify",
          text: plainText,
        })
        .catch(() => {
          navigator.clipboard.writeText(plainText)
          toast({
            title: "Copied to clipboard",
            description: "Your ASCII art has been copied to the clipboard.",
          })
        })
    } else {
      navigator.clipboard.writeText(plainText)
      toast({
        title: "Copied to clipboard",
        description: "Your ASCII art has been copied to the clipboard.",
      })
    }
  }, [asciiArt, settings.colored, toast])

  // Reset all state efficiently
  const resetAll = useCallback(() => {
    // Clean up any object URLs to prevent memory leaks
    if (image && image.startsWith("blob:")) {
      URL.revokeObjectURL(image)
    }

    setImage(null)
    setOriginalFile(null)
    setAsciiArt("")
    setActiveTab("upload")
    setSettings({
      width: 100,
      colored: true,
      inverted: false,
      characterSet: "standard",
    })
    settingsRef.current = {
      width: 100,
      colored: true,
      inverted: false,
      characterSet: "standard",
    }
    setImageSize({ width: 0, height: 0 })
  }, [])

  // Format file size for display
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }, [])

  // Handle tab change with smooth scrolling
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  return (
    <Card
      className="max-w-4xl mx-auto shadow-lg transform transition-all duration-300 hover:shadow-xl"
      ref={containerRef}
    >
      <CardContent className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="transition-all duration-300 hover:shadow-md">
              <TabsTrigger
                value="upload"
                disabled={isProcessing}
                className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Upload</span>
                <span className="sm:hidden">📤</span>
              </TabsTrigger>
              <TabsTrigger
                value="convert"
                disabled={!image || isProcessing}
                className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">⚙️</span>
              </TabsTrigger>
              <TabsTrigger
                value="result"
                disabled={!asciiArt || isProcessing}
                className="transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Result</span>
                <span className="sm:hidden">🖼️</span>
              </TabsTrigger>
            </TabsList>

            {(image || asciiArt) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetAll}
                      disabled={isProcessing || isDownloading}
                      className="transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-800"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start over</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <TabsContent value="upload" className="mt-6 animate-in fade-in-50 duration-300">
            <ImageDropzone onImageUpload={handleImageUpload} />
          </TabsContent>

          <TabsContent value="convert" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Preview</h3>
                  {originalFile && (
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1 animate-in fade-in-50 duration-300">
                        <FileType className="h-3 w-3" />
                        {originalFile.name.length > 20 ? originalFile.name.substring(0, 17) + "..." : originalFile.name}
                      </Badge>
                      <Badge variant="secondary" className="text-xs animate-in fade-in-50 duration-300 delay-100">
                        {originalFile.type.split("/")[1].toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className="text-xs animate-in fade-in-50 duration-300 delay-200">
                        {formatFileSize(originalFile.size)}
                      </Badge>
                      {imageSize.width > 0 && (
                        <Badge variant="secondary" className="text-xs animate-in fade-in-50 duration-300 delay-300">
                          {imageSize.width} × {imageSize.height}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="border rounded-md overflow-hidden h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-all duration-300 hover:shadow-md">
                    {image && (
                      <img
                        src={image || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleConvert}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert to ASCII"
                  )}
                </Button>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Settings</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="width">Width (characters)</Label>
                      <span className="text-sm text-gray-500">{settings.width}</span>
                    </div>
                    <Slider
                      id="width"
                      min={20}
                      max={200}
                      step={5}
                      value={[settings.width]}
                      onValueChange={(value) => setSettings({ ...settings, width: value[0] })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="character-set">Character Set</Label>
                    <Select
                      value={settings.characterSet}
                      onValueChange={(value) => setSettings({ ...settings, characterSet: value })}
                    >
                      <SelectTrigger
                        id="character-set"
                        className="transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700"
                      >
                        <SelectValue placeholder="Select character set" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="blocks">Blocks</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
                    <Label htmlFor="colored" className="cursor-pointer">
                      Colored Output
                    </Label>
                    <Switch
                      id="colored"
                      checked={settings.colored}
                      onCheckedChange={(checked) => setSettings({ ...settings, colored: checked })}
                      className="transition-all duration-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
                    <Label htmlFor="inverted" className="cursor-pointer">
                      Invert Characters
                    </Label>
                    <Switch
                      id="inverted"
                      checked={settings.inverted}
                      onCheckedChange={(checked) => setSettings({ ...settings, inverted: checked })}
                      className="transition-all duration-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium">Your ASCII Art</h3>
                {originalFile && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Converted from{" "}
                    {originalFile.name.length > 20 ? originalFile.name.substring(0, 17) + "..." : originalFile.name}
                    {imageSize.width > 0 && ` (${imageSize.width} × ${imageSize.height})`}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center mr-2 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 rounded-sm transition-all duration-200 ${
                      resultView === "interactive"
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => setResultView("interactive")}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Preview</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 rounded-sm transition-all duration-200 ${
                      resultView === "code"
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => setResultView("code")}
                  >
                    <Code className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Code</span>
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isDownloading}
                      className="transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700"
                    >
                      {isDownloading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span className="sr-only">Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Download</span>
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="animate-in fade-in-50 slide-in-from-top-5 duration-200">
                    <DropdownMenuItem
                      onClick={handleDownloadText}
                      disabled={isDownloading}
                      className="transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <FileType className="w-4 h-4 mr-2" />
                      Download as Text (.txt)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDownloadImage}
                      disabled={isDownloading}
                      className="transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <ImageIcon2 className="w-4 h-4 mr-2" />
                      Download as Image (.png)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  disabled={isDownloading}
                  className="transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>

            <div className="animate-in fade-in-50 duration-300">
              {resultView === "interactive" ? (
                <div className="ascii-result-container">
                  <Suspense
                    fallback={
                      <div className="w-full h-[400px] flex items-center justify-center">
                        <Skeleton className="w-full h-full rounded-md" />
                      </div>
                    }
                  >
                    <InteractiveAsciiPreview
                      asciiArt={asciiArt}
                      colored={settings.colored}
                      originalFileName={originalFile?.name}
                    />
                  </Suspense>
                </div>
              ) : (
                <div className="ascii-result-container">
                  <AsciiOutput ref={asciiOutputRef} asciiArt={asciiArt} colored={settings.colored} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
