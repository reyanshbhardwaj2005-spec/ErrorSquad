'use client';

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface HeroSectionProps {
  onGenerateClick: () => void
}

export function HeroSection({ onGenerateClick }: HeroSectionProps) {
  return (
    <section id="hero" className="relative overflow-hidden py-20 md:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container relative mx-auto px-4 text-center md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Powered by AI</span>
          </div>
          
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Explore Global Flavors Without Compromising Your Diet
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Create fusion recipes tailored to your dietary needs. Combine cuisines from around the world while respecting your health requirements.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={onGenerateClick}
              className="gap-2 px-8 text-base"
            >
              <Sparkles className="h-5 w-5" />
              Generate Fusion Recipe
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const element = document.getElementById("examples")
                if (element) element.scrollIntoView({ behavior: "smooth" })
              }}
              className="px-8 text-base"
            >
              View Examples
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
