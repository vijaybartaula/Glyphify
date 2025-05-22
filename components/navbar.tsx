"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      // Determine if we should show or hide the navbar
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10)
      setPrevScrollPos(currentScrollPos)

      // Determine if we should add background and shadow
      setScrolled(currentScrollPos > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Handle navigation with smooth scrolling
  const handleNavigation = (href: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    closeMenu()

    // If it's the same page, just scroll to top
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // Otherwise navigate to the new page
    router.push(href)

    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/convert", label: "Convert" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group" onClick={(e) => handleNavigation("/", e)}>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:from-purple-700 group-hover:to-pink-700">
            Glyphify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-all duration-200 relative",
                pathname === link.href
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400",
              )}
              onClick={(e) => handleNavigation(link.href, e)}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></span>
              )}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle />
          <a href="/convert" onClick={(e) => handleNavigation("/convert", e)}>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              Try It Now
            </Button>
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden space-x-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="transition-transform duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-white dark:bg-gray-900 animate-in slide-in-from-top duration-300">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg font-medium py-2 transition-all duration-200 border-l-4",
                  pathname === link.href
                    ? "text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 pl-4"
                    : "text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-700 hover:pl-2",
                )}
                onClick={(e) => handleNavigation(link.href, e)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4">
              <a href="/convert" onClick={(e) => handleNavigation("/convert", e)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                  Try It Now
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
