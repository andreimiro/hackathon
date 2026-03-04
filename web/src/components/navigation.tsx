"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, Show, useUser } from "@clerk/nextjs"

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
  
  const navItems = isSignedIn ? authNavItems : publicNavItems

  return (
    <nav className="border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Hackathon
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300 ${
                    pathname === item.href
                      ? "bg-orange-500/20 text-orange-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Show when="signed-out">
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 text-sm rounded-lg border-0">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>
    </nav>
  )
}

