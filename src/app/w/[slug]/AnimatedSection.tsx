'use client'

import { useEffect, useRef, useState } from 'react'

export type AnimationType = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'float-up' | 'zoom-in'

const STYLES: Record<AnimationType, {
  hidden: React.CSSProperties
  visible: React.CSSProperties
  transition: string
}> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(32px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: 'opacity 0.8s ease',
  },
  'slide-left': {
    hidden: { opacity: 0, transform: 'translateX(-48px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  },
  'slide-right': {
    hidden: { opacity: 0, transform: 'translateX(48px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  },
  'float-up': {
    hidden: { opacity: 0, transform: 'translateY(28px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
    transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
  },
  'zoom-in': {
    hidden: { opacity: 0, transform: 'scale(0.94)' },
    visible: { opacity: 1, transform: 'scale(1)' },
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  },
}

export default function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const s = STYLES[animation]

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...(visible ? s.visible : s.hidden),
        transitionDelay: `${delay}ms`,
        transition: s.transition,
      }}
    >
      {children}
    </div>
  )
}
