'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface RisingTextProps {
  text: string
  className?: string
  delay?: number
}

export default function RisingText({ text, className = '', delay = 0 }: RisingTextProps) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.6, 0.01, -0.05, 0.95],
      }}
    >
      {text}
    </motion.span>
  )
}