'use client'

import { useEffect } from 'react'

interface CourseStructuredDataProps {
  course: {
    id: string
    title: string
    description: string
    instructor_name: string
    category: string
    level: string
    duration: number
    price: number
    thumbnail_url?: string
    rating?: number
    student_count?: number
    objectives?: string[]
    requirements?: string[]
    tags?: string[]
  }
}

export default function CourseStructuredData({ course }: CourseStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.title,
      "description": course.description,
      "provider": {
        "@type": "Organization",
        "name": "dduksangLAB",
        "url": "https://dduksanglab.com",
        "logo": "https://dduksanglab.com/logo.png"
      },
      "instructor": {
        "@type": "Person",
        "name": course.instructor_name
      },
      "educationalLevel": course.level,
      "about": course.category,
      "timeRequired": `PT${Math.ceil(course.duration / 60)}M`,
      "offers": {
        "@type": "Offer",
        "price": course.price.toString(),
        "priceCurrency": "KRW",
        "availability": "https://schema.org/InStock",
        "url": `https://dduksanglab.com/lectures/${course.id}/preview`,
        "validFrom": new Date().toISOString()
      },
      "url": `https://dduksanglab.com/lectures/${course.id}/preview`,
      ...(course.thumbnail_url && {
        "image": course.thumbnail_url
      }),
      ...(course.rating && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": course.rating,
          "ratingCount": course.student_count ?? 1,
          "bestRating": 5,
          "worstRating": 1
        }
      }),
      ...(course.objectives && {
        "learningResourceType": "Course",
        "educationalUse": "instruction",
        "competencyRequired": course.requirements ?? [],
        "teaches": course.objectives
      }),
      ...(course.tags && {
        "keywords": course.tags.join(", ")
      }),
      "courseMode": "online",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "instructor": {
          "@type": "Person", 
          "name": course.instructor_name
        }
      }
    }

    // 기존 structured data 제거
    const existingScript = document.querySelector('script[data-course-structured-data]')
    if (existingScript) {
      existingScript.remove()
    }

    // 새로운 structured data 추가
    const script = document.createElement('script')
    script.setAttribute('data-course-structured-data', 'true')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.querySelector('script[data-course-structured-data]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [course])

  return null
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    }

    const existingScript = document.querySelector('script[data-breadcrumb-structured-data]')
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.setAttribute('data-breadcrumb-structured-data', 'true')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.querySelector('script[data-breadcrumb-structured-data]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [items])

  return null
}

interface OrganizationStructuredDataProps {
  organization: {
    name: string
    url: string
    logo: string
    description: string
    contactPoint?: {
      telephone: string
      contactType: string
      email: string
    }
    sameAs?: string[]
  }
}

export function OrganizationStructuredData({ organization }: OrganizationStructuredDataProps) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": organization.name,
      "url": organization.url,
      "logo": organization.logo,
      "description": organization.description,
      ...(organization.contactPoint && {
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": organization.contactPoint.telephone,
          "contactType": organization.contactPoint.contactType,
          "email": organization.contactPoint.email
        }
      }),
      ...(organization.sameAs && {
        "sameAs": organization.sameAs
      })
    }

    const existingScript = document.querySelector('script[data-organization-structured-data]')
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.setAttribute('data-organization-structured-data', 'true')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.querySelector('script[data-organization-structured-data]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [organization])

  return null
}