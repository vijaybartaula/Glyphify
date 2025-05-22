import { AsciiConverter } from "@/components/ascii-converter"

export default function ConvertPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">ASCII Art Converter</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Upload an image, customize settings, and transform it into ASCII art
          </p>
        </div>
        <AsciiConverter />
      </div>
    </div>
  )
}
