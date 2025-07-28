/**
 * Logger utility for development and production environments
 * Development: Shows all logs
 * Production: Only shows errors and warnings
 */
/* eslint-disable no-console, @typescript-eslint/no-explicit-any, no-alert */
export const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args)
    }
  },
  error: (...args: any[]) => {
    console.error(...args)
  },
  warn: (...args: any[]) => {
    console.warn(...args)
  },
  info: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args)
    }
  },
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(...args)
    }
  }
}

/**
 * Alert utility for user notifications
 * Development: Shows alerts
 * Production: Returns boolean for custom handling
 */
export const userNotification = {
  alert: (message: string): void => {
    if (process.env.NODE_ENV === 'development') {
      alert(message)
    } else {
      // In production, you might want to use a toast notification
      // For now, we'll use console.warn
      console.warn('User notification:', message)
    }
  },
  confirm: (message: string): boolean => {
    if (process.env.NODE_ENV === 'development') {
      return confirm(message)
    } else {
      // In production, you might want to use a custom modal
      // For now, we'll return true and log the message
      console.warn('User confirmation:', message)
      return true
    }
  }
}