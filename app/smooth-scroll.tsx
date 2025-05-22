"use client"

import { useEffect } from "react"

export function SmoothScroll() {
  useEffect(() => {
    // Function to handle all link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      // Only handle internal links
      if (link && link.href && link.href.startsWith(window.location.origin) && !link.hasAttribute("target")) {
        // If it's the same page, just scroll to top
        if (link.pathname === window.location.pathname) {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
          // For navigation to other pages, we'll let the default behavior happen
          // but ensure we're at the top when the new page loads
          sessionStorage.setItem("scrollToTop", "true")
        }
      }
    }

    // Check if we need to scroll to top after navigation
    const checkScrollToTop = () => {
      if (sessionStorage.getItem("scrollToTop") === "true") {
        sessionStorage.removeItem("scrollToTop")
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }

    // Add event listeners
    document.addEventListener("click", handleLinkClick)
    window.addEventListener("load", checkScrollToTop)

    // Check on initial render
    checkScrollToTop()

    return () => {
      document.removeEventListener("click", handleLinkClick)
      window.removeEventListener("load", checkScrollToTop)
    }
  }, [])

  return null
}
