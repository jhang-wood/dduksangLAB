'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function MountainAurora() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background - 먹색 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-black" />
      
      {/* Aurora effect layers */}
      <div className="absolute inset-0">
        {/* Aurora Layer 1 - Soft green/blue */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 0%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 0%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 0%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 0%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 0%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Aurora Layer 2 - Purple/pink */}
        <motion.div
          className="absolute inset-0 opacity-25"
          animate={{
            background: [
              'radial-gradient(ellipse at 80% 0%, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
              'radial-gradient(ellipse at 60% 0%, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
              'radial-gradient(ellipse at 40% 0%, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
              'radial-gradient(ellipse at 60% 0%, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
              'radial-gradient(ellipse at 80% 0%, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Aurora Layer 3 - Blue accent */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(ellipse at 30% 0%, rgba(147, 197, 253, 0.3) 0%, transparent 40%)',
              'radial-gradient(ellipse at 70% 0%, rgba(147, 197, 253, 0.3) 0%, transparent 40%)',
              'radial-gradient(ellipse at 30% 0%, rgba(147, 197, 253, 0.3) 0%, transparent 40%)',
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>
      
      {/* Mountain silhouettes */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Far mountain range */}
        <svg className="absolute bottom-0 w-full h-96" preserveAspectRatio="none" viewBox="0 0 1200 400">
          <motion.path
            d="M0,400 L0,250 Q100,200 200,220 T400,180 Q500,150 600,170 T800,140 Q900,120 1000,150 T1200,130 L1200,400 Z"
            fill="url(#farMountainGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 2 }}
          />
          <defs>
            <linearGradient id="farMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1f2937" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#111827" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Middle mountain range */}
        <svg className="absolute bottom-0 w-full h-80" preserveAspectRatio="none" viewBox="0 0 1200 350">
          <motion.path
            d="M0,350 L0,180 Q150,130 300,160 T600,120 Q750,90 900,130 T1200,100 L1200,350 Z"
            fill="url(#midMountainGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="midMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#111827" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#030712" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Near mountain range with gold accent */}
        <svg className="absolute bottom-0 w-full h-64" preserveAspectRatio="none" viewBox="0 0 1200 300">
          <motion.path
            d="M0,300 L0,120 Q200,60 400,100 T800,40 Q1000,20 1200,80 L1200,300 Z"
            fill="url(#nearMountainGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <defs>
            <linearGradient id="nearMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#030712" stopOpacity="1" />
              <stop offset="50%" stopColor="#030712" stopOpacity="1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Gold accent lines on peaks */}
        <motion.div
          className="absolute bottom-0 w-full h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 300">
            <path
              d="M0,120 Q200,60 400,100 T800,40 Q1000,20 1200,80"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="2"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
      
      {/* Floating particles for depth */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: 100 + Math.random() * 50 + '%',
            }}
            animate={{
              y: -50,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}