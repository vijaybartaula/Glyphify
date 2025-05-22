import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function GalleryPage() {
  const galleryItems = [
    {
      id: 1,
      title: "Mountain Landscape",
      description: "A serene mountain landscape converted to ASCII art",
      image: "https://i.etsystatic.com/17832180/r/il/7aa584/1851470465/il_fullxfull.1851470465_eate.jpg",
      ascii: `
      /\\\\\\\\\\\\\\\\
     /:::\\\\\\\\\\\\\\\\
    /:::::\\\\\\\\\\\\\\\\
   /::::::::\\\\\\\\\\\\\\\\
  /:::::::::::\\\\\\\\\\\\\\\\
 /:::::::::::::\\\\\\\\\\\\\\\\
/:::::::::::::::\\\\\\\\\\\\\\\\
^^^^^^^^^^^^^^^^^^^^^^^^
      `,
    },
    {
      id: 2,
      title: "Portrait",
      description: "A detailed portrait showing the power of ASCII art",
      image: "https://i0.wp.com/boingboing.net/wp-content/uploads/2015/11/1507093226663885606.jpg?fit=1&ssl=1&resize=600%2C4000",
      ascii: `
 .---.
 |   |
 |   |
 |   |
 '---'
      `,
    },
    {
      id: 3,
      title: "City Skyline",
      description: "Urban landscape rendered in ASCII characters",
      image: "https://www.creativefabrica.com/wp-content/uploads/2023/10/31/Pixel-Art-City-Skyline-82881748-1.png",
      ascii: `
      _   _
     | | | |
    _| |_| |_
   |_       _|
     |_| |_|
      `,
    },
    {
      id: 4,
      title: "Abstract Art",
      description: "Creative abstract patterns using ASCII characters",
      image: "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/c4d078f2-a2b7-4812-a328-9bc2134a4270/66ca7256-2ebe-43a4-af56-a5f81c399ca3.png",
      ascii: `
 /\\/\\/\\/\\
<        >
 \\/\\/\\/\\/
      `,
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">ASCII Art Gallery</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Explore examples of what you can create with Glyphify</p>
          <Link href="/convert">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Create Your Own
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{item.description}</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
                  <pre className="text-xs font-mono">{item.ascii}</pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
