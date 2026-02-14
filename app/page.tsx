"use client"

import { useRef } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { RecipeGenerator, type RecipeGeneratorRef } from "@/components/recipe-generator"
import { RecipeOfDay } from "@/components/recipe-of-day"
import { ExampleRecipes } from "@/components/example-recipes"
import { Footer } from "@/components/footer"

export default function Home() {
  const generatorRef = useRef<RecipeGeneratorRef>(null)

  const handleGenerateClick = () => {
    generatorRef.current?.scrollToGenerator()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection onGenerateClick={handleGenerateClick} />
        <RecipeOfDay />
        <RecipeGenerator ref={generatorRef} />
        <ExampleRecipes />
      </main>
      <Footer />
    </div>
  )
}
