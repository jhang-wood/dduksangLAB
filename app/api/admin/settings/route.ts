import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      logger.error('Error fetching system settings:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch settings',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      data: data || {
        site_name: '떡상연구소',
        site_description: 'AI 시대를 선도하는 No-Code 교육 플랫폼',
        admin_email: 'admin@dduksanglab.com',
        maintenance_mode: false,
        allow_registration: true,
        require_email_verification: true,
        max_file_size: 5,
        allowed_file_types: ['jpg', 'jpeg', 'png', 'webp']
      }
    })
  } catch (error) {
    logger.error('Unexpected error in GET /api/admin/settings:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    // Validate required fields
    if (!body.site_name || !body.admin_email) {
      return NextResponse.json({ 
        error: 'Site name and admin email are required' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.admin_email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 })
    }

    // Validate file size (1-50 MB)
    if (body.max_file_size && (body.max_file_size < 1 || body.max_file_size > 50)) {
      return NextResponse.json({ 
        error: 'Max file size must be between 1 and 50 MB' 
      }, { status: 400 })
    }

    // Validate allowed file types
    if (body.allowed_file_types && !Array.isArray(body.allowed_file_types)) {
      return NextResponse.json({ 
        error: 'Allowed file types must be an array' 
      }, { status: 400 })
    }

    const updateData = {
      site_name: body.site_name,
      site_description: body.site_description || '',
      admin_email: body.admin_email,
      maintenance_mode: Boolean(body.maintenance_mode),
      allow_registration: Boolean(body.allow_registration),
      require_email_verification: Boolean(body.require_email_verification),
      max_file_size: parseInt(body.max_file_size) || 5,
      allowed_file_types: body.allowed_file_types || ['jpg', 'jpeg', 'png', 'webp'],
      updated_at: new Date().toISOString()
    }

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('system_settings')
      .select('id')
      .limit(1)
      .single()

    let result

    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('system_settings')
        .update(updateData)
        .eq('id', existingSettings.id)
        .select()
        .single()
    } else {
      // Insert new settings
      result = await supabase
        .from('system_settings')
        .insert([updateData])
        .select()
        .single()
    }

    if (result.error) {
      logger.error('Error updating system settings:', result.error)
      return NextResponse.json({ 
        error: 'Failed to update settings',
        details: result.error.message 
      }, { status: 500 })
    }

    logger.info('System settings updated successfully')
    return NextResponse.json({ 
      data: result.data,
      message: 'Settings updated successfully' 
    })

  } catch (error) {
    logger.error('Unexpected error in PUT /api/admin/settings:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}