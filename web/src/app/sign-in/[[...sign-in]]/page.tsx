"use client"

import { SignIn } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignInPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (user && isLoaded) {
      router.push("/dashboard")
    }
  }, [user, isLoaded, router])

  return (
    <div className="warm-shell flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md px-4 py-12">
        <SignIn
          routing="hash"
          appearance={{
            elements: {
              rootBox: {
                width: "100%"
              },
              card: {
                background: "hsl(var(--card) / 0.82)",
                border: "1px solid hsl(var(--line) / 0.78)",
                borderRadius: "28px",
                boxShadow: "0 22px 70px hsl(var(--warm-shadow) / 0.16)",
                backdropFilter: "blur(18px)",
              },
              headerTitle: {
                color: "hsl(var(--foreground))",
                fontFamily: "Georgia, Times New Roman, serif",
                fontSize: "2rem",
                fontWeight: "400",
              },
              headerSubtitle: {
                color: "hsl(var(--muted-foreground))",
              },
              formFieldLabel: {
                color: "hsl(var(--foreground))",
              },
              formFieldInput: {
                background: "hsl(var(--card) / 0.72)",
                border: "1px solid hsl(var(--line))",
                color: "hsl(var(--foreground))",
                borderRadius: "16px",
              },
              formButtonPrimary: {
                background: "linear-gradient(180deg, hsl(13 94% 72%), hsl(10 82% 58%))",
                color: "#fff",
                borderRadius: "999px",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "600",
              },
              formButtonPrimaryHover: {
                background: "hsl(var(--primary))",
              },
              footer: {
                background: "transparent",
              },
              footerAction: {
                background: "transparent",
              },
              footerActionText: {
                color: "hsl(var(--muted-foreground))",
              },
              footerPagesLink: {
                color: "hsl(var(--muted-foreground))",
              },
              footerPagesLinkHover: {
                color: "hsl(var(--primary))",
              },
              badge: {
                background: "hsl(var(--foreground) / 0.05)",
                color: "hsl(var(--muted-foreground))",
              },
              badgeHover: {
                background: "rgba(255,255,255,0.1)",
              },
              developmentMode: {
                color: "hsl(var(--primary))",
              },
              footerActionLink: {
                color: "hsl(var(--primary))",
              },
              identityPreviewText: {
                color: "hsl(var(--foreground))",
              },
              identityPreviewEditButton: {
                color: "hsl(var(--primary))",
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
                background: "hsl(var(--line))",
              },
              dividerText: {
                color: "hsl(var(--muted-foreground))",
              },
              socialButtonsBlockButton: {
                background: "hsl(var(--card) / 0.62)",
                border: "1px solid hsl(var(--line))",
                color: "hsl(var(--foreground))",
                borderRadius: "999px",
              },
              socialButtonsBlockButtonHover: {
                background: "rgba(255,255,255,0.1)",
              },
              otpCodeFieldInput: {
                background: "hsl(var(--card) / 0.72)",
                border: "1px solid hsl(var(--line))",
                color: "hsl(var(--foreground))",
                borderRadius: "16px",
              },
            },
          }}
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
