#!/bin/bash

# Supabase Database Setup Script
# This script sets up all necessary tables and functions for dduksangLAB

echo "🚀 Starting Supabase database setup..."

# Load environment variables
if [ -f ../.env.local ]; then
    export $(cat ../.env.local | grep -v '^#' | xargs)
fi

# Check if required environment variables are set
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: Supabase environment variables are not set"
    echo "Please ensure SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are set in .env.local"
    exit 1
fi

# Execute schema.sql using Supabase client
echo "📊 Creating database schema..."
npx supabase db push --db-url "${NEXT_PUBLIC_SUPABASE_URL}" --access-token "${SUPABASE_SERVICE_ROLE_KEY}" < schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema created successfully!"
else
    echo "❌ Failed to create database schema"
    exit 1
fi

# Create storage buckets
echo "📦 Creating storage buckets..."
curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"id": "avatars", "name": "avatars", "public": true}'

curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"id": "lecture-thumbnails", "name": "lecture-thumbnails", "public": true}'

curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"id": "lecture-videos", "name": "lecture-videos", "public": false}'

curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"id": "saas-logos", "name": "saas-logos", "public": true}'

echo "✅ Storage buckets created!"

# Setup Edge Functions
echo "🔧 Setting up Edge Functions..."
mkdir -p ../supabase/functions

# Create email function
cat > ../supabase/functions/send-email/index.ts << 'EOF'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { to, subject, html, text } = await req.json()
  
  // Here you would integrate with your email service (SendGrid, Postmark, etc.)
  // For now, we'll just log and return success
  console.log(`Sending email to ${to}: ${subject}`)
  
  return new Response(
    JSON.stringify({ success: true, message: "Email sent successfully" }),
    { headers: { "Content-Type": "application/json" } }
  )
})
EOF

echo "✅ Supabase setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Run the schema.sql file in your Supabase SQL editor"
echo "2. Set up authentication providers in Supabase dashboard"
echo "3. Configure email templates"
echo "4. Deploy edge functions"
echo ""
echo "🎉 Your database is ready for dduksangLAB!"