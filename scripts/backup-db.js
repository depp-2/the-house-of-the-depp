#!/usr/bin/env node

/**
 * Database Backup Script
 *
 * Usage: node scripts/backup-db.js [output-dir]
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get current timestamp for filename
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * Fetch all data from a table
 */
async function fetchTable(tableName) {
  console.log(`📥 Fetching ${tableName}...`);

  const { data, error } = await supabase
    .from(tableName)
    .select('*');

  if (error) {
    console.error(`❌ Error fetching ${tableName}:`, error);
    return [];
  }

  console.log(`✓ Fetched ${data.length} records`);
  return data || [];
}

/**
 * Main backup function
 */
async function backupDatabase(outputDir) {
  const timestamp = getTimestamp();
  const backupDir = path.join(outputDir, `backup-${timestamp}`);

  console.log('\n🗄️  Starting database backup...');
  console.log(`📂 Output directory: ${backupDir}`);

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  try {
    // Backup all tables
    const tables = ['posts', 'projects', 'researches'];

    for (const table of tables) {
      const data = await fetchTable(table);

      if (data.length > 0) {
        const outputFile = path.join(backupDir, `${table}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✓ Saved ${table}.json`);
      }
    }

    // Create backup metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      tables: tables,
      counts: {},
    };

    for (const table of tables) {
      const data = await fetchTable(table);
      metadata.counts[table] = data.length;
    }

    const metadataFile = path.join(backupDir, 'metadata.json');
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf-8');

    console.log('\n✅ Backup completed successfully!');
    console.log(`📂 Backup location: ${backupDir}`);
    console.log(`📊 Total records: ${Object.values(metadata.counts).reduce((a, b) => a + b, 0)}`);

  } catch (error) {
    console.error('\n❌ Backup failed:', error);
    process.exit(1);
  }
}

// Main
const outputDir = process.argv[2] || path.join(__dirname, '../backups');
backupDatabase(outputDir);
