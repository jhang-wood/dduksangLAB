'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function ModernBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient - clean and modern */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-accent-electric/20 to-transparent rounded-full blur-3xl"
          style={{ filter: 'blur(120px)' }}
        />
        <div 
          className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-accent-neon/20 to-transparent rounded-full blur-3xl"
          style={{ filter: 'blur(120px)' }}
        />
      </div>
      
      {/* Animated gradient spots */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-96 h-96"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-accent-electric/10 to-transparent rounded-full blur-3xl" />
      </motion.div>
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  )
}