'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function AscendingArrows() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ascending arrow particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: `${20 + i * 10}%`,
            y: '110%',
            opacity: 0,
          }}
          animate={{
            y: '-10%',
            opacity: [0, 0.3, 0.5, 0.3, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeOut"
          }}
        >
          <svg width="40" height="60" viewBox="0 0 40 60" className="text-gold-foil/20">
            <path
              d="M20 0 L30 15 L25 15 L25 60 L15 60 L15 15 L10 15 Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ))}
      
      {/* Large background arrow */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5"
        animate={{
          y: ['-50%', '-52%', '-50%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="300" height="400" viewBox="0 0 300 400" className="text-gold-foil">
          <path
            d="M150 0 L300 150 L225 150 L225 400 L75 400 L75 150 L0 150 Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </div>
  )
}