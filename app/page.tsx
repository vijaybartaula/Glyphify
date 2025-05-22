import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ImageIcon, Zap, Palette, Download } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-24 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Transform Images into ASCII Art
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Glyphify turns your photos into stunning text-based masterpieces with just a few clicks. Customize,
                  create, and share your ASCII art.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/convert">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Try It Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button size="lg" variant="outline">
                    View Gallery
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Section */}
            <div className="mx-auto lg:ml-auto flex items-center justify-center">
              <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fish-shell-logo-ascii-black.svg/1200px-Fish-shell-logo-ascii-black.svg.png"
                  alt="ASCII Art Example"
                  width={500}
                  height={500}
                  className="object-cover rounded-lg shadow-2xl transform transition duration-500 ease-in-out hover:scale-110 hover:shadow-xl animate-float"
                />

                {/* ASCII Art Box 
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg transition duration-300 ease-in-out hover:shadow-2xl">
                  <pre className="text-xs font-mono text-gray-800 dark:text-gray-200">
                    {`$$$$$$$$$$$$$$$$$$$$$
$**@@@#*++=++*#@@@**$
$@#+=--------=+#@@@#$
$@*=----------==#@@$
$#=------------=#@*$
$@#====*****====@*$
$+---------------#$ 
$=~~~~~~~~~~~~~~~=$
$=+++++++++++++++=$
$+~~~~~~~~~~~~~~~=$
$#===============#$
$@*=-----------=#@$ 
$@@#+=--------=+#@$
$@#**@@@#*++++*#@@$
$***************$`}
                  </pre>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm text-purple-600 dark:text-purple-400">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Transform Your Images with Ease
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Glyphify provides powerful tools to convert your images into beautiful ASCII art with complete
                customization.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Easy Upload</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Drag and drop or select any image to instantly begin the conversion process.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Fast Processing</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Our advanced algorithms convert your images in seconds, right in your browser.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Customization</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Adjust character sets, colors, and resolution to create your perfect ASCII masterpiece.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Easy Export</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Download your ASCII art or share it directly with friends and on social media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Create Your ASCII Art?
              </h2>
              <p className="max-w-[600px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who have transformed their images into unique ASCII masterpieces.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/convert">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Start Converting Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-yellow-500 hover:bg-white/20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
