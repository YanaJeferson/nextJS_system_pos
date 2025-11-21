"use client"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const isDark = resolvedTheme === "dark"
  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle theme">
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}