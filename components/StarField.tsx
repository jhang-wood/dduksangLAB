'use client'

import React, { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Star properties
    class Star {
      x: number
      y: number
      z: number
      prevX: number
      prevY: number

      constructor() {
        this.x = (Math.random() - 0.5) * 2000
        this.y = (Math.random() - 0.5) * 2000
        this.z = Math.random() * 1000
        this.prevX = 0
        this.prevY = 0
      }

      update(speed: number) {
        this.prevX = this.x / this.z
        this.prevY = this.y / this.z
        this.z -= speed
        
        if (this.z <= 0) {
          this.x = (Math.random() - 0.5) * 2000
          this.y = (Math.random() - 0.5) * 2000
          this.z = 1000
          this.prevX = this.x / this.z
          this.prevY = this.y / this.z
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const x = this.x / this.z
        const y = this.y / this.z
        const px = this.prevX
        const py = this.prevY

        const opacity = 1 - this.z / 1000
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = 1 + (1 - this.z / 1000) * 2
        
        ctx.beginPath()
        ctx.moveTo(px + canvas.width / 2, py + canvas.height / 2)
        ctx.lineTo(x + canvas.width / 2, y + canvas.height / 2)
        ctx.stroke()
      }
    }

    // Create stars
    const stars: Star[] = []
    for (let i = 0; i < 200; i++) {
      stars.push(new Star())
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.update(3)
        star.draw(ctx)
      })

      animationId = requestAnimationFrame(animate)
    }

    // Initial background
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}