import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">About ASCII Art</h1>
          <p className="text-gray-500 dark:text-gray-400">Discover the history and beauty of ASCII art</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">What is ASCII Art?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              ASCII art is a graphic design technique that uses computers for presentation and consists of pictures
              pieced together from the 95 printable characters defined by the ASCII Standard.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              It was born in the early days of computing when graphical capabilities were limited. Artists and computer
              enthusiasts found creative ways to express visual ideas using only text characters.
            </p>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
            <Image src="https://raw.githubusercontent.com/dawsonbooth/ascii-art/master/logo.png" alt="ASCII Art Example" fill className="object-cover" />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The History of ASCII Art</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              ASCII art emerged in the 1960s and 1970s when early computer systems had limited graphical capabilities.
              It became popular in the BBS (Bulletin Board System) era of the 1980s and early 1990s before the
              widespread adoption of the World Wide Web.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Early ASCII artists created elaborate scenes, logos, and illustrations using nothing but text characters.
              These creations were shared on bulletin boards, in email signatures, and in text files distributed across
              early computer networks.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Today, ASCII art continues to be appreciated for its nostalgic appeal and minimalist aesthetic. It remains
              popular in certain computing communities and has experienced a revival as part of the broader pixel art
              movement.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How Glyphify Works</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Glyphify uses advanced algorithms to analyze your images and convert them into ASCII art. The process
              works by:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Analyzing the brightness values of each pixel in your image</li>
              <li>Mapping those brightness values to appropriate ASCII characters</li>
              <li>Arranging the characters to form a representation of the original image</li>
              <li>Optionally applying color information to create colored ASCII art</li>
            </ol>
            <p className="text-gray-600 dark:text-gray-300">
              Our tool processes everything in your browser, ensuring your images remain private and conversion happens
              instantly.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Own ASCII Art?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Try Glyphify now and transform your images into unique ASCII masterpieces.
          </p>
          <Link href="/convert">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start Converting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
