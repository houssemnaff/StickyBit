'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface PointsToastProps {
  points: number
  show: boolean
  onClose?: () => void
}

export function PointsToast({ points, show, onClose }: PointsToastProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in">
      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 border border-primary/50">
        <span className="text-lg font-bold">+{points}</span>
        <span className="text-sm font-medium">نقطة</span>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="ms-2 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
