"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronDown, Lock, Unlock, Calendar, Flag, HelpCircle, Mail, Trophy } from "lucide-react"

const HACKATHON_START = new Date("2026-03-05T19:00:00Z")

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// FAQ Item Component
function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="text-[#E84C36] font-medium">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-4' : 'max-h-0'}`}
      >
        <p className="text-gray-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [hackathonStatus, setHackathonStatus] = useState("not-started")
  const [loading, setLoading] = useState(true)
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await fetch("/api/hackathon-time")
        const data = await res.json()
        setHackathonStatus(data.status)
        // Convert API timeLeft to include days
        const totalHours = data.timeLeft.hours || 0
        const days = Math.floor(totalHours / 24)
        const hours = totalHours % 24
        setTimeLeft({
          days,
          hours,
          minutes: data.timeLeft.minutes || 0,
          seconds: data.timeLeft.seconds || 0
        })
        setLoading(false)
      } catch (e) {
        // Fallback calculation if API fails
        const now = new Date()
        const diff = HACKATHON_START.getTime() - now.getTime()
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeLeft({ days, hours, minutes, seconds })
        }
        setLoading(false)
      }
    }

    fetchTime()
    const interval = setInterval(fetchTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const faqs = [
    {
      question: "What is Menorca Hackathon?",
      answer: "Menorca Hackathon is a premier 24-hour programming competition where teams compete to recreate iOS apps with pure creativity. No strict rules, just innovation and coding excellence."
    },
    {
      question: "Who can participate?",
      answer: "Participation is open to developers, designers, and tech enthusiasts of all skill levels. Whether you're a beginner or experienced, everyone is welcome to join and showcase their skills."
    },
    {
      question: "When and where will it take place?",
      answer: "The hackathon takes place online. Participants can join from anywhere in the world. Check the timeline section for specific dates and registration deadlines."
    },
    {
      question: "Who do I contact for more information?",
      answer: "You can reach out to our organizing team via email at hello@menorcahackathon.com or through our Discord community. We're here to help with any questions!"
    },
    {
      question: "Is there a specific theme or technology stack?",
      answer: "Each edition has a specific iOS app to recreate, but you're free to use any tech stack you prefer - web, mobile, desktop, or any platform of your choice."
    }
  ]

  const timeline = [
    { date: "February 1", event: "Registrations Open", icon: Unlock, status: "completed" },
    { date: "March 1", event: "Registrations Close", icon: Lock, status: "completed" },
    { date: "March 5", event: "Pre-Hackathon", icon: Calendar, status: "upcoming" },
    { date: "March 6", event: "Final Competition", icon: Flag, status: "upcoming" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#E84C36]/20 via-[#E84C36]/5 to-transparent blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Content */}
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Unleashing Innovation,<br />
                One Challenge at a Time
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Step into the Menorca Hackathon Competition 2026, where innovation meets competition and top programmers rise to the challenge.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-[#E84C36] hover:bg-[#D13D2A] text-white font-semibold px-8 py-6 text-base rounded-lg"
                >
                  <Link href="/sign-up">Register Now!</Link>
                </Button>
              </div>
            </div>

            {/* Countdown Timer - Always visible (shows 00:00:00:00 while loading) */}
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2 md:gap-4">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 md:px-8 py-4">
                      <div className="text-3xl md:text-5xl font-bold text-amber-400 font-mono">
                        {item.value.toString().padStart(2, "0")}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Description */}
              <div className="border border-white/10 p-6 rounded-lg relative">
                <div className="absolute -top-3 left-8 px-4 bg-[#0A0A0A]">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">About</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Menorca Hackathon, organized by the tech community, is an exciting programming competition that pushes teams to solve real-world challenges. This year, we&apos;re expanding the event to include participants from various backgrounds, fostering a dynamic environment for collaboration, innovation, and skill development on a larger stage.
                </p>
                
                {/* Decorative Circle */}
                <div className="w-16 h-16 border border-[#E84C36]/30 rounded-full flex items-center justify-center mt-6">
                  <HelpCircle className="w-6 h-6 text-[#E84C36]/50" />
                </div>
              </div>

              {/* Right: CTA */}
              <div className="text-center md:text-left">
                <p className="text-gray-400 mb-4 text-sm">
                  Explore our Delegate Booklet for more information and guidelines about the competition
                </p>
                <Button 
                  className="bg-[#E84C36] hover:bg-[#D13D2A] text-white px-6"
                >
                  Guideline Booklet
                </Button>

                {/* Decorative geometric shape */}
                <div className="mt-8 flex justify-center md:justify-start">
                  <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 border border-[#E84C36]/30 rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="relative z-10 py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              Relive the Legacy of Menorca
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="border border-white/10 p-6 rounded-lg">
                <p className="text-gray-400 leading-relaxed text-sm mb-4">
                  Explore the journey of innovation and collaboration from our past hackathon events. Witness how brilliant minds came together to solve complex challenges and create impactful solutions.
                </p>
                <Button 
                  variant="outline"
                  className="border-[#E84C36] text-[#E84C36] hover:bg-[#E84C36] hover:text-white"
                >
                  Explore Menorca History
                </Button>
              </div>
              
              {/* Decorative grid */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-3">
                  <div className="w-20 h-20 border border-white/10 rounded-lg" />
                  <div className="w-20 h-20 border border-[#E84C36]/30 rounded-lg bg-[#E84C36]/5" />
                  <div className="w-20 h-20 border border-[#E84C36]/30 rounded-lg bg-[#E84C36]/5" />
                  <div className="w-20 h-20 border border-white/10 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="relative z-10 py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">Timeline</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Decorative */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-36 border border-[#E84C36]/30 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Right: Timeline */}
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      item.status === 'completed' 
                        ? 'bg-[#E84C36]/20 text-[#E84C36]' 
                        : 'bg-white/5 text-gray-500'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{item.event}</div>
                      <div className={`text-base font-semibold ${
                        item.status === 'completed' ? 'text-[#E84C36]' : 'text-white'
                      }`}>{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="relative z-10 py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
              The Ultimate Prize Awaits! 🏆
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
              One prize to rule them all. May the best coder win... and the loser pay up! 😏
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: The Legendary Prize */}
              <div className="text-center md:text-left">
                <div className="relative">
                  <span className="absolute -top-6 -left-2 text-4xl text-[#E84C36]/20">&ldquo;</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    Winner Takes All...<br />
                    <span className="text-[#E84C36]">Literally!</span>
                  </h3>
                  <span className="absolute -bottom-6 right-0 text-4xl text-[#E84C36]/20">&rdquo;</span>
                </div>
                <p className="mt-6 text-gray-400 text-sm">
                  No cash, no gadgets, no fancy certificates. Just pure culinary glory and the sweet taste of victory (with garlic sauce).
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#E84C36]/10 border border-[#E84C36]/30 rounded-lg">
                  <span className="text-[#E84C36] text-sm font-medium">💸 Paid by the loser, obviously</span>
                </div>
              </div>
              
              {/* Right: The Shawarma Trophy */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-400/30 to-[#E84C36]/30 blur-2xl rounded-full" />
                  
                  <div className="relative bg-gradient-to-b from-amber-400/20 to-[#E84C36]/20 border-2 border-amber-400/50 rounded-2xl p-8 text-center w-64">
                    <div className="text-6xl mb-4">🌯</div>
                    <Trophy className="w-10 h-10 mx-auto mb-3 text-amber-400" />
                    <div className="text-amber-400 font-bold text-lg mb-1">GRAND PRIZE</div>
                    <div className="text-white font-bold text-xl mb-2">
                      1 Chicken Shawarma
                    </div>
                    <div className="text-gray-400 text-sm mb-3">+ Soda of Choice 🥤</div>
                    <div className="pt-3 border-t border-white/10">
                      <div className="text-xs text-gray-500">(priceless bragging rights included)</div>
                    </div>
                  </div>
                  
                  {/* Decorative confetti */}
                  <div className="absolute -top-4 -right-4 text-2xl animate-bounce">✨</div>
                  <div className="absolute -bottom-2 -left-4 text-2xl animate-bounce delay-100">🎉</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            
            <div className="border border-white/10 rounded-lg p-6">
              <div className="space-y-0">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQ === index}
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative z-10 py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-xl font-bold text-white mb-8">
              Our Proud Partners Throughout Menorca
            </h2>
            
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[
                { name: "1Paper", color: "#E84C36" },
                { name: "Solt", color: "#C41E3A" },
                { name: "Carti Colorate", color: "#00A651" },
              ].map((partner, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: partner.color }}
                  >
                    {partner.name[0]}
                  </div>
                  <span className="text-gray-300 font-semibold">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="border border-white/10 rounded-lg p-6 md:p-10">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Get in Touch with Us
              </h2>
              
              <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8 text-sm">
                Have questions or need more information? We&apos;re here to help! Reach out to us for any inquiries about Menorca Hackathon.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "1Paper", email: "hello@onepaper.ai" },
                  { name: "Solt", email: "office@solt.com" },
                  { name: "Carti Colorate", email: "office@carticolorate.com" },
                ].map((contact, index) => (
                  <div key={index} className="text-center">
                    <h4 className="text-white font-semibold mb-2">{contact.name}</h4>
                    <a 
                      href={`mailto:${contact.email}`} 
                      className="flex items-center justify-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      {contact.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Menorca Hackathon. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
