"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ImageDropzoneProps {
  onImageUpload: (file: File) => void
}

export function ImageDropzone({ onImageUpload }: ImageDropzoneProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const toastShownRef = useRef(false)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB for better performance.",
          variant: "destructive",
        })
        return
      }

      setIsProcessing(true)

      // Use setTimeout to allow UI to update before heavy processing
      setTimeout(() => {
        try {
          onImageUpload(file)

          // Show success toast only once per session
          if (!toastShownRef.current) {
            toast({
              title: "Image uploaded",
              description: "Your image has been uploaded successfully.",
            })
            toastShownRef.current = true
          }
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "There was an error processing your image. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsProcessing(false)
        }
      }, 50)
    },
    [onImageUpload, toast],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      processFile(file)
    },
    [processFile],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false),
    noClick: true, // Prevent opening file dialog on container click
    // Disable if already processing
    disabled: isProcessing,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-all duration-300 transform ${
        isDragging
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02] shadow-lg"
          : isProcessing
            ? "border-gray-300 dark:border-gray-700 opacity-70"
            : "border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full transition-all duration-300 ${
            isDragging || isHovering ? "scale-110 shadow-md" : ""
          }`}
        >
          {isProcessing ? (
            <div className="h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
          ) : (
            <FileImage
              className={`h-10 w-10 text-purple-600 dark:text-purple-400 transition-transform duration-500 ${
                isDragging ? "rotate-12" : isHovering ? "rotate-6" : ""
              }`}
            />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Upload an image</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isProcessing ? "Processing your image..." : "Drag and drop an image, or click the button below"}
          </p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation() // Prevent event bubbling
            if (!isProcessing) open()
          }}
          type="button"
          variant="outline"
          disabled={isProcessing}
          className="transition-all duration-300 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 dark:hover:border-purple-700 transform hover:scale-105"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400">Supported formats: JPEG, PNG, GIF, WebP (max 10MB)</p>
      </div>
    </div>
  )
}
