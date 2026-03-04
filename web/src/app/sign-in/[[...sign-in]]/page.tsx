"use client"

import { SignIn } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { dark } from "@clerk/themes"

export default function SignInPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (user && isLoaded) {
      router.push("/dashboard")
    }
  }, [user, isLoaded, router])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-12">
        <SignIn
          routing="hash"
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: {
                width: "100%"
              },
              card: {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                boxShadow: "none",
              },
              headerTitle: {
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: "700",
              },
              headerSubtitle: {
                color: "#9CA3AF",
              },
              formFieldLabel: {
                color: "#D1D5DB",
              },
              formFieldInput: {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: "8px",
              },
              formButtonPrimary: {
                background: "#E84C36",
                color: "#fff",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "600",
              },
              formButtonPrimaryHover: {
                background: "#D13D2A",
              },
              footer: {
                background: "transparent",
              },
              footerAction: {
                background: "transparent",
              },
              footerActionText: {
                color: "#9CA3AF",
              },
              footerPagesLink: {
                color: "#9CA3AF",
              },
              footerPagesLinkHover: {
                color: "#E84C36",
              },
              badge: {
                background: "rgba(255,255,255,0.05)",
                color: "#6B7280",
              },
              badgeHover: {
                background: "rgba(255,255,255,0.1)",
              },
              developmentMode: {
                color: "#E84C36",
              },
              footerActionLink: {
                color: "#E84C36",
              },
              identityPreviewText: {
                color: "#fff",
              },
              identityPreviewEditButton: {
                color: "#E84C36",
              },
              formFieldSuccessText: {
                color: "#10B981",
              },
              formFieldErrorText: {
                color: "#EF4444",
              },
              alertText: {
                color: "#EF4444",
              },
              dividerLine: {
                background: "rgba(255,255,255,0.1)",
              },
              dividerText: {
                color: "#6B7280",
              },
              socialButtonsBlockButton: {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: "8px",
              },
              socialButtonsBlockButtonHover: {
                background: "rgba(255,255,255,0.1)",
              },
              otpCodeFieldInput: {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: "8px",
              },
            },
          }}
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
