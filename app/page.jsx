"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code,
  Command,
  Home,
  Sparkles,
  TerminalSquare,
  Infinity,
  Zap,
  ChevronRight,
  ArrowRight,
  Layers,
  Eye,
  MessageSquarePlus,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "./context/UserDetailContext";

export default function page() {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  const handleHomepage = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                HOLTEX AI
              </h1>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {!userDetail ? (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/sign-in"
                className="hidden md:inline-block px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/sign-in"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <button
              className="px-4 py-2 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
              onClick={handleHomepage}
            >
              Home
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Build React Apps With
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                  {" "}
                  AI-Powered Code
                </span>
              </motion.h1>

              <motion.p className="text-lg text-gray-600 max-w-md">
                Turn your prompts into production-ready React TypeScript code
                with instant preview using WebContainer technology.
              </motion.p>

              <motion.div className="flex flex-wrap gap-4">
                <Link
                  href="/home"
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  Start Building <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/demo"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center gap-2"
                >
                  Watch Demo <Eye className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div className="flex items-center gap-1 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs text-gray-600"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span className="ml-2">
                  Join 10,000+ developers using Holtex AI
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {/* Placeholder for hero image/animation */}
                  <div className="text-center">
                    <Code className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                    <p className="text-sm">Preview Image Placeholder</p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: 9999,
                    repeatType: "loop",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/50 to-transparent"
                  style={{ transform: "skewX(-20deg) translateX(-100%)" }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 p-4 bg-white rounded-lg shadow-lg border border-gray-100 max-w-xs"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Command className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Prompt to Code</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  "Create a responsive navbar with dropdown menu"
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -top-6 -right-6 p-4 bg-white rounded-lg shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Instant Preview</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-white to-purple-50"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supercharge Your Development
            </h2>
            <p className="text-gray-600">
              Holtex AI transforms how you build React applications with
              powerful AI-driven tools and instant previews.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Command className="h-8 w-8 text-purple-600" />,
                title: "Smart Prompt Processing",
                description:
                  "Describe what you want in natural language and get production-ready React TypeScript code instantly.",
              },
              {
                icon: <TerminalSquare className="h-8 w-8 text-purple-600" />,
                title: "TypeScript Native",
                description:
                  "Generate type-safe code with full TypeScript support for robust application development.",
              },
              {
                icon: <Eye className="h-8 w-8 text-purple-600" />,
                title: "Live Preview",
                description:
                  "See your components in action immediately with WebContainer technology.",
              },
              {
                icon: <Layers className="h-8 w-8 text-purple-600" />,
                title: "Component Library",
                description:
                  "Access a growing library of reusable components to speed up your development.",
              },
              {
                icon: <Infinity className="h-8 w-8 text-purple-600" />,
                title: "Continuous Learning",
                description:
                  "Our AI continuously improves from user feedback to generate better code over time.",
              },
              {
                icon: <MessageSquarePlus className="h-8 w-8 text-purple-600" />,
                title: "Collaborative Editing",
                description:
                  "Share projects with your team and collaborate in real-time on your application.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Holtex AI Works
            </h2>
            <p className="text-gray-600">
              From prompt to production in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Write a Prompt",
                description:
                  "Describe what you want to build in natural language with as much detail as you need.",
              },
              {
                step: "02",
                title: "Get React Code",
                description:
                  "Our AI generates clean, maintainable React TypeScript code based on your requirements.",
              },
              {
                step: "03",
                title: "Preview & Export",
                description:
                  "Instantly preview your component and export the code to your project.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-xl border border-gray-100 relative z-10">
                  <div className="text-4xl font-bold text-purple-100 mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {index < 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                    className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0"
                  >
                    <ArrowRight className="h-8 w-8 text-purple-300" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <div className="bg-gray-900 text-gray-300 p-4 text-sm font-mono overflow-auto h-64">
        <div className="text-purple-400">
          // Generated from prompt: "Create a card component with image, title,
          description and button"
        </div>
        <br />
        <div>
          <span className="text-blue-400">import</span>{" "}
          <span className="text-gray-300">React</span>{" "}
          <span className="text-blue-400">from</span>{" "}
          <span className="text-yellow-300">"react"</span>;
        </div>
        <br />
        <div>
          <span className="text-blue-400">interface</span>{" "}
          <span className="text-green-400">CardProps</span>{" "}
          <span className="text-gray-300">{"{"}</span>
        </div>
        <div className="pl-4">
          <span className="text-gray-300">title: string;</span>
        </div>
        <div className="pl-4">
          <span className="text-gray-300">description: string;</span>
        </div>
        <div className="pl-4">
          <span className="text-gray-300">imageUrl: string;</span>
        </div>
        <div className="pl-4">
          <span className="text-gray-300">btnText?: string;</span>
        </div>
        <div className="pl-4">
          <span className="text-gray-300">{"onClick?: () => void;"}</span>
        </div>
        <div>
          <span className="text-gray-300">{"}"}</span>
        </div>
        <br />
        <div>
          <span className="text-blue-400">const</span>{" "}
          <span className="text-yellow-300">Card</span>{" "}
          <span className="text-gray-300">
            {
              '= ({ title, description, imageUrl, btnText = "Learn More", onClick }: CardProps) => {'
            }
          </span>
        </div>
        <div className="pl-4">
          <span className="text-blue-400">return</span>{" "}
          <span className="text-gray-300">(</span>
        </div>
        <div className="pl-8">
          <span className="text-red-400">{"<div"}</span>{" "}
          <span className="text-green-400">className</span>
          <span className="text-gray-300">=</span>
          <span className="text-yellow-300">
            "rounded-lg overflow-hidden shadow-md max-w-xs bg-white"
          </span>
          <span className="text-red-400">{">"}</span>
        </div>
        {/* More code would go here */}
        <div className="pl-8">
          {/* Add closing tags */}
          <span className="text-red-400">{"</div>"}</span>
        </div>
        <div className="pl-4">
          <span className="text-gray-300">);</span>
        </div>
        <div>
          <span className="text-gray-300">{"};"}</span>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Developers Say
            </h2>
            <p className="text-gray-600">
              Join thousands of developers who are shipping faster with Holtex
              AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Holtex AI cut my development time in half. I can quickly prototype ideas and get working components in seconds.",
                name: "Alex Johnson",
                title: "Senior React Developer",
              },
              {
                quote:
                  "As someone new to React, this tool has been invaluable. It's like having a senior developer guiding you through complex implementations.",
                name: "Sarah Chen",
                title: "Frontend Engineer",
              },
              {
                quote:
                  "The code quality is impressive. I was skeptical at first, but the TypeScript support and component structure is exactly how I would write it myself.",
                name: "Marcus Williams",
                title: "Tech Lead",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="mb-4 text-purple-500">"</div>
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-b from-white to-purple-50"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600">
              Choose the plan that works best for you and your team
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Student Plan",
                price: "$20",
                period: "per month",
                description: "Perfect for side projects and learning",
                features: [
                  "50 AI generations per month",
                  "Basic component library",
                  "1x Sub SSL Domain",
                  "1x Sub SSL Hosting",
                ],
                btnText: "Get Started",
                highlight: false,
              },
              {
                name: "Personal Plan",
                price: "$75",
                period: "per month",
                description: "For professional developers and freelancers",
                features: [
                  "500 AI generations per month",
                  "Advanced component library",
                  "Custom AI Development",
                  "1x Standard SSL Socket",
                  "Priority support",
                ],
                btnText: "Start Free Trial",
                highlight: true,
              },
              {
                name: "Business Plan",
                price: "$1500",
                period: "per month",
                description: "For teams building together",
                features: [
                  "Unlimited AI generations",
                  "Full component library",
                  "Custom AI Development",
                  "Standard SSL Socket",
                  "1x Domain Name ",
                  "Dedicated support",
                ],
                btnText: "Contact Sales",
                highlight: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-xl border ${plan.highlight ? "border-purple-400 shadow-lg ring-1 ring-purple-100" : "border-gray-100"} overflow-hidden`}
              >
                <div className={`p-6 ${plan.highlight ? "bg-purple-50" : ""}`}>
                  <div className="font-medium text-lg text-gray-900">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-gray-500">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {plan.description}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="mt-0.5 p-0.5 rounded-full bg-purple-100">
                          <Sparkles className="h-3 w-3 text-purple-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`block w-full text-center py-2 rounded-md transition-colors ${plan.highlight ? "bg-purple-600 text-white hover:bg-purple-700" : "border border-gray-300 text-gray-700 hover:border-purple-400 hover:text-purple-600"}`}
                  >
                    {plan.btnText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-purple-600 rounded-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to transform your React development?
                </h2>
                <p className="text-purple-200 mb-8">
                  Join thousands of developers who are building faster and
                  better with Holtex AI.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/auth/sign-in"
                    className="px-6 py-3 bg-white text-purple-600 rounded-md hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="px-6 py-3 border border-purple-300 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    See Demo
                  </Link>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700">
                  <div className="absolute inset-0 opacity-20">
                    {/* Pattern or background detail would go here */}
                    <div className="h-full w-full overflow-hidden">
                      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-800 rounded-full opacity-20 transform translate-x-1/3 translate-y-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-t from-purple-50 to-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="font-bold text-xl text-purple-600">
                  Holtex
                </span>
                <span className="text-gray-900 font-bold ml-1">AI</span>
              </div>
              <p className="text-gray-500 text-sm mt-2 max-w-md">
                Turn your prompts into production-ready React TypeScript code
                with instant preview using WebContainer technology.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Product</h4>
                <ul className="space-y-2">
                  {["Features", "Pricing", "Examples", "Documentation"].map(
                    (item) => (
                      <li key={item}>
                        <Link
                          // href={`/${item.toLowerCase()}`}
                          href="#"
                          className="text-gray-600 hover:text-purple-600 text-sm"
                        >
                          {item}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Company</h4>
                <ul className="space-y-2">
                  {["About", "Blog", "Careers", "Contact"].map((item) => (
                    <li key={item}>
                      <Link
                        // href={`/${item.toLowerCase()}`}
                        href="#"
                        className="text-gray-600 hover:text-purple-600 text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Resources</h4>
                <ul className="space-y-2">
                  {["Tutorials", "FAQ", "Support", "API"].map((item) => (
                    <li key={item}>
                      <Link
                        // href={`/${item.toLowerCase()}`}
                        href="#"
                        className="text-gray-600 hover:text-purple-600 text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Legal</h4>
                <ul className="space-y-2">
                  {["Privacy", "Terms", "Security", "Cookies"].map((item) => (
                    <li key={item}>
                      <Link
                        // href={`/${item.toLowerCase()}`}
                        href="#"
                        className="text-gray-600 hover:text-purple-600 text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Holtex AI. All rights reserved.
            </p>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/"
                className="p-2 bg-gray-100 rounded-full hover:bg-purple-100 hover:text-purple-600 transition-colors"
              >
                <Home size={18} />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full hover:bg-purple-100 hover:text-purple-600 transition-colors"
              >
                <Github size={18} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full hover:bg-purple-100 hover:text-purple-600 transition-colors"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full hover:bg-purple-100 hover:text-purple-600 transition-colors"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
