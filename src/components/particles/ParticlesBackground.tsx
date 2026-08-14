'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface ParticlesBackgroundProps {
  particleCount?: number
  particleSize?: number
  speed?: number
  opacity?: number
  backgroundColor?: string
  connectionLines?: boolean
  connectionDistance?: number
  connectionOpacity?: number
  className?: string
}

export default function ParticlesBackground({
  particleCount = 50,
  particleSize = 2,
  speed = 1,
  opacity = 0.8,
  backgroundColor = '#000000',
  connectionLines = false,
  connectionDistance = 100,
  connectionOpacity = 0.3,
  className = ''
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  const initializeParticles = (width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * particleSize + 1,
        opacity: Math.random() * opacity + 0.1,
        color: '#FFFFFF'
      })
    }
    particlesRef.current = particles
  }

  const updateParticles = (width: number, height: number) => {
    particlesRef.current.forEach((particle) => {
      particle.vx = particle.vx / Math.abs(particle.vx || 1) * speed * (Math.random() * 0.5 + 0.75)
      particle.vy = particle.vy / Math.abs(particle.vy || 1) * speed * (Math.random() * 0.5 + 0.75)
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0) { particle.x = width }
      if (particle.x > width) { particle.x = 0 }
      if (particle.y < 0) { particle.y = height }
      if (particle.y > height) { particle.y = 0 }
    })
  }

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)

    if (connectionLines) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${connectionOpacity})`
      ctx.lineWidth = 1
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
            ctx.stroke()
          }
        }
      }
    }

    particlesRef.current.forEach((particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
      ctx.fill()
    })
  }

  const animate = () => {
    if (!canvasRef.current) { return }
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }

    updateParticles(canvas.width, canvas.height)
    draw(ctx, canvas.width, canvas.height)
    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement
        const rect = parent.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    initializeParticles(dimensions.width, dimensions.height)
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = dimensions.width
      canvas.height = dimensions.height
    }
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, particleCount, speed, opacity, particleSize, connectionLines, connectionDistance, connectionOpacity])

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  )
}
