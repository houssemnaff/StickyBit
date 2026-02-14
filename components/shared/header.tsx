'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X } from 'lucide-react'
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
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🛡️</span>
          <span>CyberAman</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:opacity-80 transition">
            الرئيسية
          </Link>
          <Link href="/how-attackers-work" className="hover:opacity-80 transition">
            ألعاب
          </Link>
          <Link href="/simulator" className="hover:opacity-80 transition">
            محاكاة
          </Link>
          <Link href="/detector" className="hover:opacity-80 transition">
            كاشف
          </Link>
          <Link href="/academy" className="hover:opacity-80 transition">
            أكاديمية
          </Link>
          <Link href="/assessment" className="hover:opacity-80 transition">
            اختبر أمانك
          </Link>
          <Link href="/recovery" className="hover:opacity-80 transition">
            دليل التعافي
          </Link>
          <Link href="/glossary" className="hover:opacity-80 transition">
            القاموس
          </Link>
          <Link href="/report" className="hover:opacity-80 transition">
            بلّغ
          </Link>
          <Link href="/profile" className="hover:opacity-80 transition">
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
            className="text-primary-foreground hover:bg-primary-foreground/20"
            aria-label="تبديل الوضع الليلي"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Senior Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSeniorMode}
            className={`text-xs ${seniorMode ? 'bg-primary-foreground/20' : ''}`}
            aria-label="وضع كبار السن"
          >
            {seniorMode ? 'عادي' : 'كبار السن'}
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-primary-foreground"
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
        <nav className="md:hidden bg-primary-foreground/10 border-t border-primary-foreground/20 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-3">
            <Link
              href="/"
              className="block py-2 hover:opacity-80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              href="/simulator"
              className="block py-2 hover:opacity-80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              محاكاة
            </Link>
            <Link
              href="/detector"
              className="block py-2 hover:opacity-80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              كاشف
            </Link>
            <Link
              href="/academy"
              className="block py-2 hover:opacity-80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              أكاديمية
            </Link>
            <Link
              href="/assessment"
              className="block py-2 hover:opacity-80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              اختبر أمانك
            </Link>
            <Link
              href="/recovery"
              className="block py-2 hover:opacity-80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              دليل التعافي
            </Link>
            <Link
              href="/glossary"
              className="block py-2 hover:opacity-80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              القاموس
            </Link>
            <Link
              href="/report"
              className="block py-2 hover:opacity-80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              بلّغ عن احتيال
            </Link>
            <Link
              href="/profile"
              className="block py-2 hover:opacity-80 transition"
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
