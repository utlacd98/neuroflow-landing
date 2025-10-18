"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Brain, Headphones, BarChart3, Zap, Heart, TrendingUp, Check, Sparkles, Star } from "lucide-react"

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  yEnd: number;
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate particles only on client side
    const newParticles: Particle[] = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      yEnd: Math.random() * -100 - 50,
    }));
    setParticles(newParticles);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
          initial={{
            x: particle.x + "%",
            y: particle.y + "%",
          }}
          animate={{
            y: [particle.y + "%", particle.yEnd + "%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function FocusyncLanding() {
  const [email, setEmail] = useState("")
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const handleLaunchApp = () => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('focusync_session');
      if (session) {
        // User is authenticated, go to dashboard
        window.location.href = '/dashboard';
      } else {
        // User is not authenticated, go to auth page
        window.location.href = '/auth';
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.2 } },
    viewport: { once: true },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 text-white overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated gradient background with parallax */}
        <motion.div className="absolute inset-0 opacity-40" style={{ y: backgroundY }}>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-sky-500/20 animate-gradient-shift" />
        </motion.div>

        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-400 to-sky-400 animate-wave-flow"
            style={{
              clipPath:
                "polygon(0 50%, 10% 45%, 20% 55%, 30% 48%, 40% 52%, 50% 50%, 60% 48%, 70% 52%, 80% 45%, 90% 55%, 100% 50%, 100% 100%, 0 100%)",
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-sky-400 via-teal-500 to-emerald-400 animate-wave-flow-reverse opacity-50"
            style={{
              clipPath:
                "polygon(0 60%, 10% 55%, 20% 65%, 30% 58%, 40% 62%, 50% 60%, 60% 58%, 70% 62%, 80% 55%, 90% 65%, 100% 60%, 100% 100%, 0 100%)",
            }}
          />
        </div>

        <FloatingParticles />

        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 mb-8 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-300 relative z-10">AI-Powered Focus Technology</span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent leading-tight text-balance relative"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            Find Your Flow. Focus That Adapts to You.
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed text-pretty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            FOCUSYNC uses AI to tune soundscapes around your mind's rhythm — focus longer, think clearer, feel calmer.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-teal-500/50 transition-all hover:shadow-xl hover:shadow-teal-500/60 relative overflow-hidden group"
                onClick={handleLaunchApp}
              >
                <span className="relative z-10">Launch App</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>

            <Dialog>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-teal-400/50 bg-teal-950/30 backdrop-blur-sm hover:bg-teal-900/40 text-teal-100 px-8 py-6 text-lg rounded-xl relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Get Early Access
                    </span>
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-teal-500/30 text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-teal-300">Join the Waitlist</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Be the first to experience adaptive focus technology.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-teal-500/30 text-white placeholder:text-slate-500"
                  />
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
                    Get Early Access
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-teal-400/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-teal-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Three simple steps to unlock your peak performance
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Brain,
                title: "Detects Your Focus Pattern",
                description: "Our AI analyzes your typing rhythm and activity to understand your natural flow state.",
              },
              {
                icon: Headphones,
                title: "Adapts Sound in Real Time",
                description: "Soundscapes dynamically adjust to match and enhance your current mental state.",
              },
              {
                icon: BarChart3,
                title: "Gives You AI Insights",
                description: "Track your focus patterns and get personalized recommendations to optimize productivity.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 group h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <motion.div
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center mb-6"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <item.icon className="w-8 h-8 text-teal-400" />
                      </motion.div>
                      <h3 className="text-2xl font-semibold mb-4 text-teal-100">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-transparent via-teal-950/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-sky-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-400 font-medium">
              Everything you need for adaptive focus
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Brain, title: "AI-Powered", description: "Intelligent adaptation to your focus patterns" },
              { icon: Headphones, title: "Binaural Beats", description: "Neuroscience-backed audio frequencies" },
              { icon: BarChart3, title: "Analytics", description: "Track your focus trends over time" },
              { icon: Zap, title: "Real-Time", description: "Instant audio adaptation to your activity" },
              { icon: Heart, title: "Wellness", description: "Stress reduction and mental clarity" },
              { icon: TrendingUp, title: "Progress", description: "Measurable improvements in focus" },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 h-full group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <feature.icon className="w-8 h-8 text-teal-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-teal-100">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          {[
            {
              icon: Brain,
              title: "Flow Mode",
              subtitle: "For deep concentration",
              description:
                "Immerse yourself in adaptive soundscapes designed to eliminate distractions and maintain peak focus for hours. 40 Hz binaural beats enhance attention and problem-solving.",
              gradient: "from-teal-500 to-emerald-500",
              features: ["40 Hz Gamma waves", "Deep focus enhancement", "Distraction elimination"],
            },
            {
              icon: Heart,
              title: "Calm Mode",
              subtitle: "Reduce stress instantly",
              description:
                "Let AI-generated ambient sounds wash away anxiety and create a peaceful mental environment when you need it most. 10 Hz alpha waves promote relaxation.",
              gradient: "from-emerald-500 to-sky-500",
              features: ["10 Hz Alpha waves", "Stress reduction", "Light meditation"],
            },
            {
              icon: TrendingUp,
              title: "Energize Mode",
              subtitle: "Boost motivation and memory",
              description:
                "Activate your mind with stimulating audio patterns that enhance alertness, creativity, and information retention. 25 Hz beta waves boost energy.",
              gradient: "from-sky-500 to-teal-500",
              features: ["25 Hz Beta waves", "Memory enhancement", "Creative boost"],
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <motion.div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${benefit.gradient} bg-opacity-20 mb-6`}
                  whileHover={{ scale: 1.05 }}
                >
                  <benefit.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{benefit.title}</span>
                </motion.div>
                <h3 className="text-4xl font-bold mb-4 text-teal-100">{benefit.subtitle}</h3>
                <p className="text-xl text-slate-400 leading-relaxed mb-6">{benefit.description}</p>
                <ul className="space-y-3">
                  {benefit.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.gradient}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-xl border border-teal-500/20 group bg-gradient-to-br from-slate-800 to-slate-900 h-80 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-center">
                    <benefit.icon className="w-24 h-24 mx-auto mb-4 text-teal-400 opacity-50" />
                    <p className="text-slate-400 text-lg">{benefit.title}</p>
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity duration-300`}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
              What Users Say
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { quote: "Finally, a focus tool that actually adapts to how I work. My productivity has increased by 40%.", author: "Sarah K.", role: "Product Designer", rating: 5 },
              { quote: "The binaural beats are incredible. I can code for hours without fatigue.", author: "Michael R.", role: "Software Engineer", rating: 5 },
              { quote: "Way better than static playlists. The AI feedback helps me understand my patterns.", author: "Emma L.", role: "Content Creator", rating: 5 },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 h-full relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      ))}
                    </div>
                    <p className="text-lg text-slate-300 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                    <div>
                      <p className="text-teal-400 font-medium">— {testimonial.author}</p>
                      <p className="text-slate-500 text-sm">{testimonial.role}</p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-sky-300 bg-clip-text text-transparent">
              Simple Pricing
            </h2>
            <p className="text-xl text-slate-400">Start free, upgrade anytime</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                name: "Free Tier",
                price: "£0",
                period: "forever",
                features: ["2 sound modes", "Daily focus report", "Basic analytics", "Community support"],
                cta: "Start Free",
                highlighted: false,
              },
              {
                name: "Pro Tier",
                price: "£3.99",
                period: "per month",
                features: [
                  "All sound modes",
                  "Adaptive Mode with AI",
                  "Advanced analytics",
                  "Priority support",
                  "Custom soundscapes",
                ],
                cta: "Upgrade Anytime",
                highlighted: true,
              },
            ].map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <motion.div whileHover={{ scale: 1.05, y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card
                    className={`p-8 h-full ${plan.highlighted ? "bg-gradient-to-br from-teal-900/50 to-emerald-900/50 border-teal-400/50 shadow-xl shadow-teal-500/20 relative overflow-hidden" : "bg-slate-900/50 border-teal-500/20"} backdrop-blur-sm`}
                  >
                    {plan.highlighted && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2 text-teal-100">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400 ml-2">/ {plan.period}</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className={`w-full ${plan.highlighted ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600" : "bg-slate-800 hover:bg-slate-700"} text-white`}
                      >
                        {plan.cta}
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-teal-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-slate-400">© FOCUSYNC 2025 | Built by App Harbour Studios</p>
            </div>
            <nav className="flex gap-6" aria-label="Footer navigation">
              <Link href="/terms" className="text-slate-400 hover:text-teal-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-slate-400 hover:text-teal-400 transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-slate-400 hover:text-teal-400 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
