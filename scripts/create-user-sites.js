const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUserSitesTable() {
  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'create-user-sites-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Creating user_sites table...');
    
    // Since we can't execute SQL directly, show instructions
    console.log('Note: Please run the SQL manually in Supabase Dashboard.');
    console.log('\n📋 Copy and paste this SQL in Supabase SQL Editor:\n');
    console.log('https://app.supabase.com/project/' + supabaseUrl.split('.')[0].replace('https://', '') + '/sql/new\n');
    console.log(sql);
    console.log('\n========================================\n');
    return;
    
    console.log('✅ Table created successfully!');
    
    // Test the table
    console.log('\nTesting user_sites table...');
    const { data: testData, error: testError } = await supabase
      .from('user_sites')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Table test failed:', testError.message);
    } else {
      console.log('✅ Table is accessible and working!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createUserSitesTable();