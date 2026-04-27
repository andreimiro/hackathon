"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Github,
  Mail,
  Sparkle,
  Users,
} from "lucide-react"

const HACKATHON_START = new Date("2026-03-05T19:00:00Z")

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border-b border-[hsl(var(--line)/0.72)] last:border-b-0">
      <button onClick={onClick} className="flex w-full items-center justify-between gap-6 py-5 text-left">
        <span className="font-medium text-foreground">{question}</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-44 pb-5" : "max-h-0"}`}>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{answer}</p>
      </div>
    </div>
  )
}

function CountdownCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-[hsl(var(--line)/0.75)] bg-[hsl(var(--card)/0.68)] px-4 py-3 text-center shadow-inner">
      <div className="font-mono text-3xl font-semibold text-foreground md:text-4xl">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
    </div>
  )
}

function DashboardPreview({ timeLeft }: { timeLeft: TimeLeft }) {
  return (
    <div className="aqua-panel relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] p-3">
      <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-[hsl(var(--primary)/0.12)] blur-3xl" />
      <div className="rounded-[1.5rem] border border-[hsl(var(--line)/0.76)] bg-[hsl(var(--surface)/0.78)]">
        <div className="flex items-center gap-2 border-b border-[hsl(var(--line)/0.72)] px-5 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff6b55]" />
          <span className="h-3 w-3 rounded-full bg-[#f6c45b]" />
          <span className="h-3 w-3 rounded-full bg-[#78bd78]" />
          <span className="ml-auto text-xs font-medium text-muted-foreground">menorca.app/dashboard</span>
        </div>

        <div className="grid min-h-[460px] md:grid-cols-[190px_1fr]">
          <aside className="hidden border-r border-[hsl(var(--line)/0.72)] p-5 md:block">
            <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-semibold text-stone-900 shadow-sm dark:bg-stone-900 dark:text-amber-100">
              MH
            </div>
            {["Overview", "Schedule", "Participants", "Projects", "Sponsors"].map((item, index) => (
              <div
                key={item}
                className={`mb-2 rounded-xl px-3 py-2 text-sm ${
                  index === 0 ? "bg-white text-foreground shadow-sm dark:bg-white/8" : "text-muted-foreground"
                }`}
              >
                {item}
              </div>
            ))}
            <div className="mt-24 overflow-hidden rounded-2xl border border-[hsl(var(--line)/0.72)]">
              <Image
                src="/menorca-warm-reference.png"
                alt="Warm Menorca event visual"
                width={320}
                height={180}
                className="h-32 w-full object-cover object-[50%_58%]"
              />
            </div>
          </aside>

          <main className="p-5 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="fine-label">Event starts in</div>
                <h2 className="serif-display mt-3 text-3xl text-foreground md:text-4xl">Welcome back, Ada</h2>
                <p className="mt-2 text-sm text-muted-foreground">Build something careful, useful, and beautiful.</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <CountdownCard value={timeLeft.days} label="Days" />
                <CountdownCard value={timeLeft.hours} label="Hrs" />
                <CountdownCard value={timeLeft.minutes} label="Min" />
                <CountdownCard value={timeLeft.seconds} label="Sec" />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[hsl(var(--line)/0.72)] bg-white/58 p-5 shadow-sm dark:bg-white/5">
              <div className="fine-label">Your repository</div>
              <div className="mt-4 flex flex-col gap-4 rounded-xl border border-[hsl(var(--line)/0.72)] bg-[hsl(var(--card)/0.72)] p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <div>
                    <div className="font-medium text-foreground">menorca-hackathon/project-aqua</div>
                    <div className="text-xs text-muted-foreground">Next.js · TypeScript · Updated 2h ago</div>
                  </div>
                </div>
                <Button className="glass-button rounded-full">Open repository <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[hsl(var(--line)/0.72)] bg-[hsl(var(--card)/0.58)] p-5">
                <div className="fine-label">Your team</div>
                <div className="mt-4 text-lg font-medium">Aqua Builders</div>
                <div className="mt-5 flex -space-x-3">
                  {[1, 2, 3, 4].map((item) => (
                    <span key={item} className="h-10 w-10 rounded-full border-2 border-[hsl(var(--card))] bg-gradient-to-br from-amber-200 to-stone-400" />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[hsl(var(--line)/0.72)] bg-[hsl(var(--card)/0.58)] p-5">
                <div className="fine-label">What is next</div>
                <div className="mt-4 space-y-3 text-sm">
                  {["Complete your team profile", "Submit your project idea", "Check the schedule"].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b border-[hsl(var(--line)/0.52)] pb-3 last:border-b-0">
                      <span>{item}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await fetch("/api/hackathon-time")
        const data = await res.json()
        const totalHours = data.timeLeft.hours || 0
        setTimeLeft({
          days: Math.floor(totalHours / 24),
          hours: totalHours % 24,
          minutes: data.timeLeft.minutes || 0,
          seconds: data.timeLeft.seconds || 0,
        })
      } catch {
        const now = new Date()
        const diff = HACKATHON_START.getTime() - now.getTime()
        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          })
        }
      }
    }

    fetchTime()
    const interval = setInterval(fetchTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const faqs = [
    {
      question: "What is Menorca Hackathon?",
      answer: "A focused build weekend for people who care about product, craft, and clear execution. Teams ship a working project and share the story behind it.",
    },
    {
      question: "Who can participate?",
      answer: "Developers, designers, students, product people, and small teams are welcome. The event is intentionally practical, friendly, and output-oriented.",
    },
    {
      question: "What do I need to register?",
      answer: "A Clerk account and a public GitHub repository. The app saves your registration in Supabase and uses the repository to show progress.",
    },
    {
      question: "Can I use any stack?",
      answer: "Yes. Web, mobile, desktop, hardware, or anything else that lets you build and demo the idea clearly.",
    },
  ]

  return (
    <main className="warm-shell min-h-screen">
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="glass-button mx-auto inline-flex rounded-full px-4 py-2 text-sm text-muted-foreground">
              June 13-15, 2026 · Mahon, Menorca
            </div>
            <h1 className="serif-display mx-auto mt-8 max-w-5xl text-6xl leading-[0.96] text-foreground sm:text-7xl lg:text-8xl">
              Build with Taste
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Three days to ship ideas, meet exceptional people, and build the future on the beautiful island of Menorca.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="aqua-button h-12 rounded-full px-7 text-sm font-semibold">
                <Link href="/sign-up">Register now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild className="glass-button h-12 rounded-full px-7 text-sm font-semibold">
                <Link href="#schedule">Explore event</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <DashboardPreview timeLeft={timeLeft} />
          </div>

          <div className="mt-12 text-center">
            <div className="fine-label">Scroll to discover</div>
            <div className="mx-auto mt-3 h-10 w-px bg-[hsl(var(--line))]" />
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(var(--line)/0.72)] px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="fine-label">Community</div>
            <h2 className="serif-display mt-4 max-w-md text-4xl leading-tight text-foreground md:text-5xl">
              Who joins Menorca Hackathon?
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Developers", "from-amber-100 to-stone-300"],
              ["Designers", "from-stone-200 to-orange-200"],
              ["Product people", "from-rose-100 to-amber-200"],
              ["Students", "from-zinc-200 to-stone-400"],
              ["Entrepreneurs", "from-orange-100 to-stone-300"],
            ].map(([label, gradient]) => (
              <div key={label} className="aqua-panel overflow-hidden rounded-2xl p-2">
                <div className={`h-44 rounded-xl bg-gradient-to-br ${gradient}`} />
                <div className="mt-2 rounded-full bg-[hsl(var(--card)/0.84)] px-3 py-2 text-center text-xs font-medium shadow-sm">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="schedule" className="px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:items-center">
          <div>
            <div className="fine-label">Simple registration</div>
            <h2 className="serif-display mt-4 text-4xl leading-tight text-foreground md:text-5xl">Get in, team up, build.</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">The event flow is intentionally light. You bring the craft; we keep the path clear.</p>
            <Button asChild className="aqua-button mt-7 h-12 rounded-full px-7">
              <Link href="/register">Register now <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {[
              [Users, "Create your account", "Tell us who you are and what you build."],
              [Users, "Join or create a team", "Find your crew or start your own."],
              [Code2, "Submit your idea", "Share a project idea or explore others."],
              [Check, "You are in", "Receive updates and get ready for build day."],
            ].map(([Icon, title, copy], index) => (
              <div key={title as string} className="relative text-center">
                <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--line))] bg-[hsl(var(--card)/0.9)] font-medium">
                  {index + 1}
                </div>
                <div className="aqua-panel rounded-2xl p-5">
                  <Icon className="mx-auto h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{title as string}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{copy as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prizes" className="px-4 pb-20 sm:px-6">
        <div className="metal-strip mx-auto grid max-w-7xl gap-0 overflow-hidden rounded-2xl md:grid-cols-4">
          {[
            ["48", "Hours", "Of non-stop building"],
            ["600+", "Participants", "From around the world"],
            ["150+", "Projects", "Built and shipped"],
            ["EUR30K+", "In prizes", "For the best ideas"],
          ].map(([value, label, copy]) => (
            <div key={label} className="border-b border-[hsl(var(--line)/0.62)] p-8 text-center md:border-b-0 md:border-r last:border-r-0">
              <div className="serif-display text-5xl text-foreground">{value}</div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
              <div className="mt-3 text-sm text-muted-foreground">{copy}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[hsl(var(--line)/0.72)] px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.58fr_1fr] lg:items-center">
          <div>
            <div className="text-5xl text-[hsl(var(--primary))]">&ldquo;</div>
            <h2 className="serif-display mt-3 max-w-md text-4xl leading-tight text-foreground">
              Menorca is more than a beautiful place. It is the perfect setting to build meaningful things together.
            </h2>
            <p className="mt-6 text-sm text-muted-foreground">Clara Pons · Event Organizer</p>
            <Button className="glass-button mt-8 rounded-full">Meet the team <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="aqua-panel overflow-hidden rounded-3xl p-3">
            <div className="relative h-[360px] overflow-hidden rounded-2xl">
              <Image
                src="/menorca-warm-reference.png"
                alt="Menorca waterfront event atmosphere"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover object-[50%_72%]"
              />
              <div className="aqua-panel absolute bottom-6 left-6 max-w-md rounded-2xl p-5">
                <div className="font-semibold text-foreground">Our mission</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Inspire builders to create with purpose, share knowledge, and shape a better future.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.6fr_1fr]">
          <div>
            <div className="fine-label">FAQ</div>
            <h2 className="serif-display mt-4 text-4xl text-foreground md:text-5xl">Good questions, clear answers.</h2>
          </div>
          <div className="aqua-panel rounded-3xl px-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] border border-[hsl(var(--line))] bg-[hsl(var(--foreground))] p-8 text-[hsl(var(--background))] md:grid-cols-[1fr_0.8fr] md:p-12">
          <div>
            <h2 className="serif-display max-w-xl text-4xl leading-tight md:text-5xl">Ready to build something beautiful?</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 opacity-72">Join us in Menorca this June and create something that lasts beyond the weekend.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full bg-[hsl(var(--primary))] px-7 text-white hover:bg-[hsl(var(--primary)/0.9)]">
                <Link href="/sign-up">Register now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/5 px-7 text-current hover:bg-white/10">
                <Link href="#schedule">Explore event</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-40 w-72">
              <div className="absolute bottom-0 left-0 h-20 w-56 rounded-xl bg-stone-300 shadow-2xl dark:bg-stone-700" />
              <Sparkle className="absolute left-24 top-2 h-20 w-20 text-[hsl(var(--primary))]" />
              <div className="absolute bottom-9 right-4 h-24 w-2 rotate-45 rounded-full bg-olive-700/70" />
              <div className="absolute bottom-11 right-9 h-16 w-2 -rotate-45 rounded-full bg-olive-700/70" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[hsl(var(--line)/0.72)] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/menorca-logo-mark.png"
              alt="Menorca Hackathon logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg"
            />
            <span>Menorca Hackathon</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href="mailto:hello@menorcahackathon.com" className="inline-flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" />
              hello@menorcahackathon.com
            </a>
            <span>Mahon, Menorca, Spain</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
