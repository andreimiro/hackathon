"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, Show, useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const publicNavItems = [
  { href: "/", label: "Home" },
  { href: "#faq", label: "FAQ" },
  { href: "#prizes", label: "Prize" },
]

const authNavItems = [
  { href: "/", label: "Home" },
  { href: "/participants", label: "Participants" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/dashboard", label: "Dashboard" },
]

export function Navigation() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = isSignedIn ? authNavItems : publicNavItems

  return (
    <nav className="sticky top-0 z-50 border-b border-[hsl(var(--line)/0.7)] bg-[hsl(var(--background)/0.76)] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/menorca-logo-mark.png"
              alt="Menorca Hackathon logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl shadow-sm"
              priority
            />
            <span className="leading-none">
              <span className="block text-sm font-semibold tracking-[0.22em] text-foreground">MENORCA</span>
              <span className="block text-[0.62rem] font-semibold tracking-[0.26em] text-muted-foreground">HACKATHON</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="glass-button flex gap-1 rounded-full p-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    pathname === item.href
                      ? "bg-white text-stone-900 shadow-sm dark:bg-amber-300"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Show when="signed-out">
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="rounded-full text-sm font-medium text-muted-foreground hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="aqua-button rounded-full px-6 text-sm font-semibold">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </Show>

            <ThemeToggle />

            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Show when="signed-in">
              <UserButton />
            </Show>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="glass-button rounded-full p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 border-t border-[hsl(var(--line)/0.7)] pb-4 pt-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                    pathname === item.href
                      ? "bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--primary))]"
                      : "text-muted-foreground hover:bg-[hsl(var(--foreground)/0.06)] hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <Show when="signed-out">
                <div className="mt-4 flex flex-col gap-2 border-t border-[hsl(var(--line)/0.7)] pt-4">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="aqua-button w-full justify-start rounded-xl px-4 py-3 text-sm font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </Show>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
