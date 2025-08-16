#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function deleteAllAiTrends() {
  console.log('🗑️  Deleting all AI trends...');
  
  const { error } = await supabase
    .from('ai_trends')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (dummy condition)
  
  if (error) {
    console.error('❌ Error deleting AI trends:', error);
    return;
  }
  
  console.log('✅ All AI trends deleted successfully');
}

deleteAllAiTrends();