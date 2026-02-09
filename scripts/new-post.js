#!/usr/bin/env node

/**
 * Create a new blog post from a template
 *
 * Usage: node scripts/new-post.js <template> <slug> <title>
 *
 * Example:
 *   node scripts/new-post.js blog-post my-new-post "My New Post"
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('❌ Error: Missing arguments');
  console.log('\nUsage: node scripts/new-post.js <template> <slug> <title>');
  console.log('\nAvailable templates:');
  console.log('  - blog-post');
  console.log('  - tutorial');
  console.log('  - postmortem');
  console.log('\nExample:');
  console.log('  node scripts/new-post.js blog-post my-new-post "My New Post"');
  process.exit(1);
}

const [templateName, slug, title] = args;

// Map template names to files
const templates = {
  'blog-post': 'templates/blog-post.md',
  'tutorial': 'templates/tutorial.md',
  'postmortem': 'templates/postmortem.md'
};

if (!templates[templateName]) {
  console.log(`❌ Error: Unknown template "${templateName}"`);
  console.log(`\nAvailable templates: ${Object.keys(templates).join(', ')}`);
  process.exit(1);
}

const templatePath = path.join(__dirname, '..', templates[templateName]);
const outputPath = path.join(__dirname, '..', `${slug}.md`);

// Check if file already exists
if (fs.existsSync(outputPath)) {
  console.log(`❌ Error: File "${slug}.md" already exists`);
  process.exit(1);
}

// Read template
let content = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
// Use local date (KST: GMT+9) instead of UTC
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const date = `${year}-${month}-${day}`;

content = content
  .replace(/\[Post Title\]/g, title)
  .replace(/\[Tutorial Title\]: \[What You'll Build or Learn\]/g, `${title}: [What readers will learn]`)
  .replace(/\[Project Name\]: Postmortem/g, `${title}: Postmortem`)
  .replace(/YYYY-MM-DD/g, date)
  .replace(/\[What You'll Build or Learn\]/g, '[Describe what readers will accomplish]')
  .replace(/\[Published Date\]/g, date)
  .replace(/\[Author\]/g, '뎁')
  .replace(/\[Contact info\]/g, 'https://github.com/lightwater2');

// Write new post
fs.writeFileSync(outputPath, content);

console.log(`✅ Created new post: ${slug}.md`);
console.log(`📝 Template: ${templateName}`);
console.log(`📄 Path: ${outputPath}`);
console.log(`\nNext steps:`);
console.log(`  1. Edit ${slug}.md to add your content`);
console.log(`  2. When ready, create an insert script (see insert-first-post.js)`);
console.log(`  3. Run the insert script to publish to Supabase`);
