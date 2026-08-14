import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Fade in animation
export const fadeIn = (element: gsap.TweenTarget, delay = 0, duration = 0.6) => {
  return gsap.fromTo(element, 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
  )
}

// Fade in from left
export const fadeInLeft = (element: gsap.TweenTarget, delay = 0, duration = 0.6) => {
  return gsap.fromTo(element,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
  )
}

// Fade in from right
export const fadeInRight = (element: gsap.TweenTarget, delay = 0, duration = 0.6) => {
  return gsap.fromTo(element,
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
  )
}

// Scale in animation
export const scaleIn = (element: gsap.TweenTarget, delay = 0, duration = 0.6) => {
  return gsap.fromTo(element,
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration, delay, ease: 'power2.out' }
  )
}

// Stagger animation for multiple elements
export const staggerFadeIn = (elements: gsap.TweenTarget, stagger = 0.1, delay = 0) => {
  return gsap.fromTo(elements,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, delay, stagger, ease: 'power2.out' }
  )
}

// Slide up animation
export const slideUp = (element: gsap.TweenTarget, delay = 0, duration = 0.8) => {
  return gsap.fromTo(element,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration, delay, ease: 'power3.out' }
  )
}

// Parallax effect
export const parallax = (element: gsap.TweenTarget & Element, speed = 0.5) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

// Counter animation
export const animateCounter = (element: gsap.TweenTarget, endValue: number, duration = 2) => {
  const obj = { value: 0 }
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      if (element instanceof HTMLElement) {
        element.textContent = Math.floor(obj.value).toString()
      }
    },
  })
}

// Floating animation
export const floating = (element: gsap.TweenTarget, duration = 3, y = 10) => {
  return gsap.to(element, {
    y,
    duration: duration / 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

// Pulse animation
export const pulse = (element: gsap.TweenTarget, duration = 1.5) => {
  return gsap.to(element, {
    scale: 1.05,
    duration: duration / 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (
  animation: 'fadeIn' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideUp',
  options?: {
    delay?: number
    duration?: number
    stagger?: number
    start?: string
  }
) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) { return }

    const element = ref.current
    const { delay = 0, duration = 0.6, start = 'top 80%' } = options || {}

    let anim: gsap.core.Tween

    switch (animation) {
      case 'fadeIn':
        anim = fadeIn(element, delay, duration)
        break
      case 'fadeInLeft':
        anim = fadeInLeft(element, delay, duration)
        break
      case 'fadeInRight':
        anim = fadeInRight(element, delay, duration)
        break
      case 'scaleIn':
        anim = scaleIn(element, delay, duration)
        break
      case 'slideUp':
        anim = slideUp(element, delay, duration)
        break
      default:
        anim = fadeIn(element, delay, duration)
    }

    ScrollTrigger.create({
      trigger: element,
      start,
      onEnter: () => anim.play(),
      onLeaveBack: () => anim.reverse(),
    })

    return () => {
      anim.kill()
      return undefined
    }
  }, [animation, options])

  return ref
}

// Custom hook for stagger animations
export const useStaggerAnimation = (
  containerSelector: string,
  itemSelector: string,
  options?: {
    stagger?: number
    delay?: number
    start?: string
  }
) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) { return }

    const container = ref.current
    const items = container.querySelectorAll(itemSelector)
    const { stagger = 0.1, delay = 0, start = 'top 80%' } = options || {}

    const anim = staggerFadeIn(items, stagger, delay)

    ScrollTrigger.create({
      trigger: container,
      start,
      onEnter: () => anim.play(),
      onLeaveBack: () => anim.reverse(),
    })

    return () => {
      anim.kill()
      return undefined
    }
  }, [containerSelector, itemSelector, options])

  return ref
}
