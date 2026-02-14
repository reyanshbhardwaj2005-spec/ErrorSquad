"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChefHat } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <ChefHat className="h-7 w-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">FlavorFusion Pro</span>
            <span className="hidden text-xs text-muted-foreground sm:block">AI-Powered Cross-Cultural Fusion Recipes</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("generator")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Generate
          </button>
          <button
            onClick={() => scrollToSection("examples")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Examples
          </button>
          <Button
            onClick={() => scrollToSection("generator")}
            size="sm"
          >
            Get Started
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("generator")}
              className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Generate
            </button>
            <button
              onClick={() => scrollToSection("examples")}
              className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Examples
            </button>
            <Button
              onClick={() => scrollToSection("generator")}
              className="w-full"
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
