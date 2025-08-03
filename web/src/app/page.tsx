import Link from "next/link";
import { Heart, Sun, Users, CheckCircle, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 min-h-screen flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-teal-200 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Your Journey to
              <span className="block text-emerald-200">Wellness Begins</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your mind, body, and spirit with personalized wellness
              sessions, expert guidance, and a community that supports your
              growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
              </Link>
              <Link
                href="#features"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Wellness
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform offers tools and guidance to support
              every aspect of your wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Meditation & Mindfulness */}
            <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sun className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Meditation & Mindfulness
              </h3>
              <p className="text-gray-600 mb-6">
                Guided meditation sessions, breathing exercises, and mindfulness
                practices to center your mind and reduce stress.
              </p>
              <ul className="space-y-2 text-gray-600">
                {[
                  "Daily guided sessions",
                  "Progress tracking",
                  "Personalized recommendations",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Personal Coaching */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Personal Coaching
              </h3>
              <p className="text-gray-600 mb-6">
                One-on-one sessions with certified wellness coaches to create
                personalized plans for your unique goals.
              </p>
              <ul className="space-y-2 text-gray-600">
                {[
                  "Certified professionals",
                  "Flexible scheduling",
                  "Goal-oriented approach",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Support */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Community Support
              </h3>
              <p className="text-gray-600 mb-6">
                Connect with like-minded individuals on similar wellness
                journeys. Share experiences and motivate each other.
              </p>
              <ul className="space-y-2 text-gray-600">
                {[
                  "Group challenges",
                  "Discussion forums",
                  "Success celebrations",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Wellness Seekers Worldwide
            </h2>
            <p className="text-emerald-100 text-xl">
              Join thousands who have transformed their lives with Arvyax Zen
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "50K+", label: "Sessions Completed" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-5xl font-bold mb-2 animate-pulse">
                  {stat.number}
                </div>
                <div className="text-emerald-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 text-xl">
              Real stories from real people who found their wellness path
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Marketing Manager",
                content:
                  "Arvyax Zen has completely transformed my approach to stress management. The guided sessions fit perfectly into my busy schedule.",
                initial: "S",
                bgColor: "bg-emerald-100",
                textColor: "text-emerald-600",
              },
              {
                name: "Michael Rodriguez",
                role: "Software Developer",
                content:
                  "The personal coaching sessions have been incredible. My coach really understands my goals and helps me stay accountable.",
                initial: "M",
                bgColor: "bg-blue-100",
                textColor: "text-blue-600",
              },
              {
                name: "Amanda Foster",
                role: "Teacher",
                content:
                  "The community aspect is what sets Arvyax Zen apart. I've made genuine connections with people who share similar wellness goals.",
                initial: "A",
                bgColor: "bg-purple-100",
                textColor: "text-purple-600",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center mr-4`}
                  >
                    <span
                      className={`${testimonial.textColor} font-bold text-lg`}
                    >
                      {testimonial.initial}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Begin Your{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Wellness Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of others who have discovered inner peace, better
            health, and lasting happiness through Arvyax Zen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
          <p className="text-gray-500 mt-4">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-emerald-400 mr-2" />
                <span className="text-2xl font-bold">Arvyax Zen</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering your wellness journey with personalized guidance and
                community support.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: ["Features", "Pricing", "API", "Mobile App"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "Community", "Blog"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Privacy", "Terms"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="hover:text-emerald-400 transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Arvyax Zen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
