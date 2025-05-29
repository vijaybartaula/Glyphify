// Worker setup for offloading heavy processing
let asciiWorker: Worker | null = null

// Initialize worker if browser supports it
const initWorker = () => {
  if (typeof window !== "undefined" && window.Worker) {
    try {
      const workerCode = `
        self.onmessage = function(e) {
          const { imageData, width, height, charset, colored, inverted } = e.data;
          
          let result = '';
          const charsetArray = inverted ? charset.split('').reverse().join('') : charset;
          
          if (colored) {
            result = processColoredAscii(imageData, width, height, charsetArray);
          } else {
            result = processGrayscaleAscii(imageData, width, height, charsetArray);
          }
          
          self.postMessage(result);
        };
        
        function processGrayscaleAscii(pixels, width, height, charset) {
          let result = '';
          
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = (y * width + x) * 4;
              
              // Calculate grayscale value
              const r = pixels[idx];
              const g = pixels[idx + 1];
              const b = pixels[idx + 2];
              const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              
              // Map brightness to character
              const charIndex = Math.floor(brightness * (charset.length - 1));
              result += charset[charIndex];
            }
            result += '\\n';
          }
          
          return result;
        }
        
        function processColoredAscii(pixels, width, height, charset) {
          let result = '';
          
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = (y * width + x) * 4;
              
              // Get RGB values
              const r = pixels[idx];
              const g = pixels[idx + 1];
              const b = pixels[idx + 2];
              
              // Calculate brightness
              const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              
              // Map brightness to character
              const charIndex = Math.floor(brightness * (charset.length - 1));
              const char = charset[charIndex];
              
              // Add colored character with span
              result += \<span style="color: rgb(\${r}, \${g}, \${b})">\${char}</span>\;
            }
            result += '<br/>';
          }
          
          return result;
        }
      `

      const blob = new Blob([workerCode], { type: "application/javascript" })
      asciiWorker = new Worker(URL.createObjectURL(blob))
    } catch (e) {
      console.warn("Web Worker initialization failed:", e)
      asciiWorker = null
    }
  }
}

// Improve the conversion function to maintain proper aspect ratio and resolution
export async function convertToAscii(
  imageUrl: string,
  width: number,
  charset: string,
  colored: boolean,
  inverted: boolean,
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Initialize worker if needed and supported
    if (!asciiWorker) {
      initWorker()
    }

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          throw new Error("Could not get canvas context")
        }

        // Calculate dimensions with better aspect ratio preservation
        const aspectRatio = img.height / img.width
        const calculatedWidth = width

        // Use a more accurate character aspect ratio factor (most monospace fonts are taller than wide)
        // Typical character aspect ratio is around 0.5-0.6 (width/height)
        const charAspectRatio = 0.55
        const calculatedHeight = Math.round(width * aspectRatio * charAspectRatio)

        // Set canvas size
        canvas.width = calculatedWidth
        canvas.height = calculatedHeight

        // Draw image on canvas with proper scaling
        ctx.drawImage(img, 0, 0, calculatedWidth, calculatedHeight)

        // Get image data
        const imageData = ctx.getImageData(0, 0, calculatedWidth, calculatedHeight)
        const pixels = imageData.data

        // Process image data into ASCII
        if (asciiWorker) {
          // Use worker for processing
          asciiWorker.onmessage = (e) => {
            resolve(e.data)
          }

          asciiWorker.onerror = (e) => {
            console.error("Worker error:", e)
            // Fallback to main thread processing
            processInMainThread()
          }

          asciiWorker.postMessage({
            imageData: pixels,
            width: calculatedWidth,
            height: calculatedHeight,
            charset,
            colored,
            inverted,
          })
        } else {
          // Process in main thread if worker not available
          processInMainThread()
        }

        function processInMainThread() {
          let result = ""
          if (colored) {
            result = processColoredAscii(pixels, calculatedWidth, calculatedHeight, charset, inverted)
          } else {
            result = processGrayscaleAscii(pixels, calculatedWidth, calculatedHeight, charset, inverted)
          }
          resolve(result)
        }

        // Clean up to prevent memory leaks
        URL.revokeObjectURL(img.src)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = imageUrl
  })
}

function processGrayscaleAscii(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  charset: string,
  inverted: boolean,
): string {
  let result = ""
  const charsetArray = inverted ? charset.split("").reverse().join("") : charset

  // Process in chunks for better UI responsiveness
  const chunkSize = Math.ceil(height / 4) // Process in 4 chunks

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4

      // Calculate grayscale value
      const r = pixels[idx]
      const g = pixels[idx + 1]
      const b = pixels[idx + 2]
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255

      // Map brightness to character
      const charIndex = Math.floor(brightness * (charsetArray.length - 1))
      result += charsetArray[charIndex]
    }
    result += "\n"

    // Allow UI to update periodically
    if (y % chunkSize === 0 && y > 0) {
      // This would be a good place to report progress if needed
    }
  }

  return result
}

function processColoredAscii(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  charset: string,
  inverted: boolean,
): string {
  let result = ""
  const charsetArray = inverted ? charset.split("").reverse().join("") : charset

  // Process in chunks for better UI responsiveness
  const chunkSize = Math.ceil(height / 4) // Process in 4 chunks

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4

      // Get RGB values
      const r = pixels[idx]
      const g = pixels[idx + 1]
      const b = pixels[idx + 2]

      // Calculate brightness
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255

      // Map brightness to character
      const charIndex = Math.floor(brightness * (charsetArray.length - 1))
      const char = charsetArray[charIndex]

      // Add colored character with span
      result += <span style="color: rgb(${r}, ${g}, ${b})">${char}</span>
    }
    result += "<br/>"

    // Allow UI to update periodically
    if (y % chunkSize === 0 && y > 0) {
      // This would be a good place to report progress if needed
    }
  }

  return result
}

// Improve the captureAsciiArtAsImage function with solid black background
export async function captureAsciiArtAsImage(container: HTMLDivElement): Promise<string> {
  // Create a clone of the container to manipulate without affecting the original
  const clone = container.cloneNode(true) as HTMLDivElement

  // Get the full content dimensions (including scrolled content)
  const fullHeight = container.scrollHeight
  const fullWidth = container.scrollWidth

  // Apply specific styling for the capture
  clone.style.position = "absolute"
  clone.style.left = "-9999px"
  clone.style.top = "-9999px"
  clone.style.width = ${fullWidth}px
  clone.style.height = ${fullHeight}px
  clone.style.maxHeight = "none" // Remove max-height constraint
  clone.style.overflow = "visible" // Make sure nothing is hidden
  clone.style.backgroundColor = "#000000" // Use solid black background instead of transparent

  // Remove all padding and margins to eliminate extra space
  clone.style.padding = "0"
  clone.style.margin = "0"
  clone.style.border = "none"

  // Ensure the font is monospace with consistent sizing
  clone.style.fontFamily = "monospace"
  clone.style.fontSize = getComputedStyle(container).fontSize
  clone.style.lineHeight = "1.2" // Consistent line height

  // For better contrast on black background, ensure text is visible
  clone.style.color = "#ffffff" // Default white text for better contrast

  // Add to document to compute styles
  document.body.appendChild(clone)

  try {
    // Use html2canvas to capture the exact rendering
    const canvas = await html2canvas(clone, {
      backgroundColor: "#000000", // Use solid black background
      scale: 2, // Higher resolution
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: fullWidth,
      height: fullHeight,
      // Ensure we capture the full height
      windowHeight: fullHeight,
      windowWidth: fullWidth,
      // Don't clip anything
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      // Fix padding issues
      removeContainer: true,
      // Trim whitespace
      trimWhitespace: true,
    })

    // Aggressively trim the canvas to remove all extra whitespace
    const trimmedCanvas = trimCanvas(canvas)

    // Convert to data URL
    const dataUrl = trimmedCanvas.toDataURL("image/png")

    // Clean up
    document.body.removeChild(clone)

    return dataUrl
  } catch (error) {
    // Clean up on error
    if (document.body.contains(clone)) {
      document.body.removeChild(clone)
    }

    // Fallback method if html2canvas fails
    return fallbackCaptureMethod(container)
  }
}

// Enhanced function to trim canvas whitespace more aggressively
function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const context = canvas.getContext("2d")
  if (!context) return canvas

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  const data = pixels.data

  let left = canvas.width
  let top = canvas.height
  let right = 0
  let bottom = 0
  let foundContent = false

  // Find the boundaries of non-black pixels (since we're using black background now)
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const pixelIndex = (y * canvas.width + x) * 4
      const r = data[pixelIndex]
      const g = data[pixelIndex + 1]
      const b = data[pixelIndex + 2]
      const alpha = data[pixelIndex + 3]

      // Check if pixel is not black (has content)
      if (alpha > 0 && (r > 10 || g > 10 || b > 10)) {
        foundContent = true
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }

  // If no content was found, return the original canvas
  if (!foundContent) return canvas

  // Add a minimal margin (2px) to avoid cutting off characters
  left = Math.max(0, left - 2)
  top = Math.max(0, top - 2)
  right = Math.min(canvas.width - 1, right + 2)
  bottom = Math.min(canvas.height - 1, bottom + 2)

  // Calculate dimensions
  const trimmedWidth = right - left + 1
  const trimmedHeight = bottom - top + 1

  // Create a new canvas with the trimmed dimensions
  const trimmedCanvas = document.createElement("canvas")
  trimmedCanvas.width = trimmedWidth
  trimmedCanvas.height = trimmedHeight

  const trimmedContext = trimmedCanvas.getContext("2d")
  if (trimmedContext) {
    // Fill with black background first
    trimmedContext.fillStyle = "#000000"
    trimmedContext.fillRect(0, 0, trimmedWidth, trimmedHeight)

    // Draw only the content area to the new canvas
    trimmedContext.drawImage(canvas, left, top, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight)
  }

  return trimmedCanvas
}

// Improved fallback method with black background
function fallbackCaptureMethod(container: HTMLDivElement): string {
  const fullHeight = container.scrollHeight
  const fullWidth = container.scrollWidth

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Could not get canvas context")
  }

  // Set canvas dimensions to the full content size
  canvas.width = fullWidth
  canvas.height = fullHeight

  // Fill with black background
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Get the HTML content
  const html = container.innerHTML

  // Create a data URL from the HTML content with black background styling
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${fullWidth}" height="${fullHeight}">
      <rect width="100%" height="100%" fill="#000000"/>
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: monospace; white-space: pre; padding: 0; margin: 0; border: none; width: ${fullWidth}px; height: ${fullHeight}px; background-color: #000000; color: #ffffff;">
          ${html}
        </div>
      </foreignObject>
    </svg>
  `

  // Convert SVG to data URL
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
  return URL.createObjectURL(svgBlob)
}

// Function to load the html2canvas library dynamically with caching
let html2canvasPromise: Promise<any> | null = null

function html2canvas(element: HTMLElement, options: any): Promise<HTMLCanvasElement> {
  // If we already have a promise for loading html2canvas, reuse it
  if (html2canvasPromise) {
    return html2canvasPromise.then(() => {
      return (window as any).html2canvas(element, options)
    })
  }

  // Check if html2canvas is already loaded
  if ((window as any).html2canvas) {
    return (window as any).html2canvas(element, options)
  }

  // Load html2canvas dynamically
  html2canvasPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js"
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

  return html2canvasPromise.then(() => {
    return (window as any).html2canvas(element, options)
  })
}
