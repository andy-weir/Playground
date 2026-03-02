import { useEffect, useState } from 'react'
import { motion } from '@/components/motion'

interface TourOverlayProps {
  targetSelector: string
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export function TourOverlay({ targetSelector }: TourOverlayProps) {
  const [targetRect, setTargetRect] = useState<Rect | null>(null)

  useEffect(() => {
    const updateRect = () => {
      const element = document.querySelector(targetSelector)
      if (element) {
        const rect = element.getBoundingClientRect()
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
      } else {
        setTargetRect(null)
      }
    }

    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [targetSelector])

  const padding = 8

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
    >
      <svg className="h-full w-full">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{
                  x: targetRect.left - padding,
                  y: targetRect.top - padding,
                  width: targetRect.width + padding * 2,
                  height: targetRect.height + padding * 2,
                  opacity: 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.5)"
          mask="url(#tour-mask)"
        />
      </svg>

      {targetRect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            x: targetRect.left - padding,
            y: targetRect.top - padding,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
          className="pointer-events-none absolute left-0 top-0 rounded-lg ring-2 ring-primary ring-offset-2"
        />
      )}
    </motion.div>
  )
}
