import Link from "next/link"
import { Github, Twitter, Instagram, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8"> {/* Reduced padding */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4"> {/* Reduced gap */}
          <div className="space-y-3"> {/* Reduced space between items */}
            <h3 className="text-lg font-bold">Glyphify</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Transform your images into stunning ASCII art with our easy-to-use converter.
            </p>
            <div className="flex space-x-3"> {/* Reduced space between icons */}
              <Link href="https://github.com/bijaybartaula" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://github.com/bijaybartaula" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://github.com/bijaybartaula" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://github.com/bijaybartaula" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400"> {/* Reduced space between links */}
              <li>
                <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/convert" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Convert
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-600 dark:hover:text-purple-400">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400"> {/* Reduced space between links */}
              <li>
                <Link href="/about" className="hover:text-purple-600 dark:hover:text-purple-400">
                  ASCII Art History
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Legal</h3>
            <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400"> {/* Reduced space between links */}
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t pt-6 text-center text-sm text-gray-500 dark:text-gray-400"> {/* Reduced margin and padding */}
          <p>© {new Date().getFullYear()} Glyphify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
