#!/usr/bin/env node

/**
 * Insert Post into Database Script
 *
 * Usage: node scripts/insert-post.js <post-file.md>
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials.');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const lines = content.split('\n');
  let frontmatter = {};
  let frontmatterEnd = -1;
  let bodyStart = -1;

  // Find frontmatter
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i === 0 && line === '---') {
      frontmatterStart = i;
      continue;
    }

    if (frontmatterStart >= 0 && i > 0 && line === '---') {
      frontmatterEnd = i;
      break;
    }

    if (frontmatterStart >= 0 && i > 0 && frontmatterEnd === -1) {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        frontmatter[key] = value;
      }
    }
  }

  // Find body
  for (let i = frontmatterEnd + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim()) {
      bodyStart = i;
      break;
    }
  }

  const body = lines.slice(bodyStart >= 0 ? bodyStart : 0).join('\n');

  return { frontmatter, body, bodyStart };
}

/**
 * Extract post data from markdown file
 */
function extractPostData(content) {
  const { frontmatter, body } = parseFrontmatter(content);

  // Generate slug from filename or title
  let slug = frontmatter.slug;
  let title = frontmatter.title;

  if (!title && frontmatter['[Post Title]']) {
    title = frontmatter['[Post Title]'];
  }

  if (!slug && title) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  return {
    slug,
    title,
    excerpt: frontmatter.excerpt || frontmatter['Summary (Excerpt)'],
    content: body,
    published_at: frontmatter.published || null,
  };
}

/**
 * Insert post into Supabase
 */
async function insertPost(postData) {
  console.log('\n📤 Inserting post into database...');
  console.log(`  Slug: ${postData.slug}`);
  console.log(`  Title: ${postData.title}`);

  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single();

  if (error) {
    console.error('\n❌ Error inserting post:');
    console.error(error);
    process.exit(1);
  }

  console.log('\n✅ Post inserted successfully!');
  console.log(`🆔 ID: ${data.id}`);
  console.log(`📊 View count: ${data.view_count}`);
  console.log('\nPost URL:');
  console.log(`  https://the-house-of-the-depp.vercel.app/blog/${data.slug}`);
}

// Main
if (process.argv.length < 3) {
  console.log('Usage: node scripts/insert-post.js <post-file.md>');
  process.exit(1);
}

const [,, filename] = process.argv;
const filePath = path.join(__dirname, '..', filename);

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filename}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');
const postData = extractPostData(content);

insertPost(postData);
