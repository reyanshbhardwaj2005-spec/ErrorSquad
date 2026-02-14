import { ChefHat } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">FlavorFusion Pro</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Built for Foodoscope Hackathon 2025
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 FlavorFusion Pro
          </p>
        </div>
      </div>
    </footer>
  )
}
