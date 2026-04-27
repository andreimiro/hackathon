"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light"
    return window.localStorage.getItem("theme") === "dark" ? "dark" : "light"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const chooseTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme)
    window.localStorage.setItem("theme", nextTheme)
  }

  return (
    <div className="glass-button inline-flex rounded-full p-1 text-xs">
      <button
        type="button"
        onClick={() => chooseTheme("light")}
        className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 transition ${
          theme === "light" ? "bg-white text-stone-900 shadow-sm dark:bg-amber-300" : "text-muted-foreground"
        }`}
        aria-pressed={theme === "light"}
      >
        <Sun className="h-3.5 w-3.5" />
        Light
      </button>
      <button
        type="button"
        onClick={() => chooseTheme("dark")}
        className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 transition ${
          theme === "dark" ? "bg-stone-950 text-amber-200 shadow-sm" : "text-muted-foreground"
        }`}
        aria-pressed={theme === "dark"}
      >
        <Moon className="h-3.5 w-3.5" />
        Dark
      </button>
    </div>
  )
}
