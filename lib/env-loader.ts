/**
 * Environment Variable Loader
 * Safely loads and validates environment variables for client and server
 */

import { readFileSync } from 'fs'
import { join } from 'path'

type EnvType = 'client' | 'server' | 'all'

/**
 * Load environment variables from specific files
 */
export function loadEnvVars(type: EnvType = 'all') {
  const envFiles: string[] = []
  
  if (type === 'client' || type === 'all') {
    envFiles.push('.env.client')
  }
  
  if (type === 'server' || type === 'all') {
    envFiles.push('.env.server')
  }
  
  // Always load .env.local last (overrides others)
  envFiles.push('.env.local')
  envFiles.push('.env')
  
  const loadedVars: Record<string, string> = {}
  
  for (const file of envFiles) {
    try {
      const envPath = join(process.cwd(), file)
      const envContent = readFileSync(envPath, 'utf8')
      
      // Parse env file content
      envContent.split('\n').forEach(line => {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=')
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '')
            loadedVars[key] = value
          }
        }
      })
    } catch (error) {
      // File doesn't exist or can't be read, continue
      continue
    }
  }
  
  return loadedVars
}

/**
 * Validate that sensitive server variables are not exposed to client
 */
export function validateEnvSeparation() {
  const serverOnlyVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'TOSS_SECRET_KEY',
    'OPENAI_API_KEY',
    'GEMINI_API_KEY',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'CRON_SECRET',
    'DATABASE_URL',
    'SMTP_PASS',
    'AWS_SECRET_ACCESS_KEY'
  ]
  
  const violations: string[] = []
  
  // Check if any server-only variables are exposed (start with NEXT_PUBLIC_)
  for (const varName of serverOnlyVars) {
    const publicVarName = `NEXT_PUBLIC_${varName}`
    if (process.env[publicVarName]) {
      violations.push(`${varName} is exposed as ${publicVarName}`)
    }
  }
  
  if (violations.length > 0) {
    throw new Error(
      `Environment variable security violations detected:\n${violations.join('\n')}\n` +
      'Server-only variables must not start with NEXT_PUBLIC_'
    )
  }
  
  return true
}

/**
 * Get client-safe environment variables only
 */
export function getClientEnvVars() {
  const clientVars: Record<string, string> = {}
  
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('NEXT_PUBLIC_') && value) {
      clientVars[key] = value
    }
  }
  
  return clientVars
}

/**
 * Get server-only environment variables
 */
export function getServerEnvVars() {
  const serverVars: Record<string, string> = {}
  
  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith('NEXT_PUBLIC_') && value) {
      serverVars[key] = value
    }
  }
  
  return serverVars
}

/**
 * Development helper: Check for potential security issues
 */
export function auditEnvSecurity() {
  const issues: string[] = []
  
  // Check for sensitive data in client variables
  const sensitivePatterns = [
    /secret/i,
    /private/i,
    /password/i,
    /token/i,
    /_key$/i
  ]
  
  const clientVars = getClientEnvVars()
  
  for (const [key, value] of Object.entries(clientVars)) {
    for (const pattern of sensitivePatterns) {
      if (pattern.test(key) && !key.includes('PUBLIC')) {
        issues.push(`Potentially sensitive variable exposed to client: ${key}`)
      }
      
      if (pattern.test(value)) {
        issues.push(`Client variable ${key} contains potentially sensitive data`)
      }
    }
  }
  
  return {
    passed: issues.length === 0,
    issues
  }
}