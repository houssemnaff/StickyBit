'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X, Shield } from 'lucide-react'
import { setDarkMode, setSeniorMode, getAccessibilityPreferences } from '@/lib/accessibility'

export function Header() {
  const [darkMode, setDarkModeLocal] = useState(false)
  const [seniorMode, setSeniorModeLocal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const prefs = getAccessibilityPreferences()
    setDarkModeLocal(prefs.darkMode)
    setSeniorModeLocal(prefs.seniorMode)
  }, [])

  const toggleDarkMode = () => {
    const newState = !darkMode
    setDarkMode(newState)
    setDarkModeLocal(newState)
  }

  const toggleSeniorMode = () => {
    const newState = !seniorMode
    setSeniorMode(newState)
    setSeniorModeLocal(newState)
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white shadow-2xl relative overflow-hidden">
      {/* Background overlay effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
          <Shield className="h-8 w-8 text-emerald-400" />
          <span className="text-xl md:text-2xl">
            Cyber<span className="text-emerald-400">Aman</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            الرئيسية
          </Link>
          <Link href="/how-attackers-work" className="hover:text-emerald-400 transition-colors">
           كيفاش يسرقوك؟
          </Link>
          <Link href="/simulator" className="hover:text-emerald-400 transition-colors">
            محاكاة
          </Link>
          <Link href="/detector" className="hover:text-emerald-400 transition-colors">
            كاشف
          </Link>
          <Link href="/academy" className="hover:text-emerald-400 transition-colors">
            أكاديمية
          </Link>
          <Link href="/assessment" className="hover:text-emerald-400 transition-colors">
            اختبر أمانك
          </Link>
          <Link href="/recovery" className="hover:text-emerald-400 transition-colors">
            خطة الطوارئ 
          </Link>
          <Link href="/glossary" className="hover:text-emerald-400 transition-colors">
           تعلم المصطلحات
          </Link>
          <Link href="/report" className="hover:text-emerald-400 transition-colors">
           نحذّرو بعضنا
          </Link>
          <Link href="/profile" className="hover:text-emerald-400 transition-colors">
            الإنجازات
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-white hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
            aria-label="تبديل الوضع الليلي"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Senior Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSeniorMode}
            className={`text-xs transition-all ${
              seniorMode 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'hover:bg-emerald-500/20 hover:text-emerald-400'
            }`}
            aria-label="وضع كبار السن"
          >
            {seniorMode ? 'عادي' : 'كبار السن'}
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white hover:text-emerald-400 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="فتح القائمة"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-emerald-500/20 py-4 relative z-10">
          <div className="container mx-auto px-4 flex flex-col gap-3">
            <Link
              href="/"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              href="/how-attackers-work"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              كيفاش يسرقوك؟
            </Link>
            <Link
              href="/simulator"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              محاكاة
            </Link>
            <Link
              href="/detector"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              كاشف
            </Link>
            <Link
              href="/academy"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              أكاديمية
            </Link>
            <Link
              href="/assessment"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              اختبر أمانك
            </Link>
            <Link
              href="/recovery"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              خطة الطوارئ
            </Link>
            <Link
              href="/glossary"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              تعلم المصطلحات
            </Link>
            <Link
              href="/report"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              نحذّرو بعضنا
            </Link>
            <Link
              href="/profile"
              className="block py-2 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              الإنجازات
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}