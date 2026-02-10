#!/usr/bin/env node

/**
 * Create New Post Script
 *
 * Usage: node scripts/new-post.js <template> <slug> <title>
 *
 * Templates:
 * - blog-post
 * - tutorial
 * - postmortem
 * - library-review
 * - technical-deep-dive
 * - quick-tips
 * - project-showcase
 * - api-tutorial
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Available templates
const templates = {
  'blog-post': 'blog-post.md',
  'tutorial': 'tutorial.md',
  'postmortem': 'postmortem.md',
  'library-review': 'library-review.md',
  'technical-deep-dive': 'technical-deep-dive.md',
  'quick-tips': 'quick-tips.md',
  'project-showcase': 'project-showcase.md',
  'api-tutorial': 'api-tutorial.md',
};

/**
 * Display usage information
 */
function showUsage() {
  console.log('\n📝 Create New Post\n');
  console.log('Usage: node scripts/new-post.js <template> <slug> <title>\n');
  console.log('\nAvailable templates:');
  Object.keys(templates).forEach(template => {
    console.log(`  - ${template.padEnd(20)} (${templates[template]})`);
  });
  console.log('\nExample:');
  console.log('  node scripts/new-post.js blog-post my-new-post "My New Post"\n');
}

/**
 * Create post from template
 */
function createPost(templateName, slug, title) {
  const templateFile = templates[templateName];

  if (!templateFile) {
    console.error(`❌ Template "${templateName}" not found.`);
    console.log('Available templates:', Object.keys(templates).join(', '));
    process.exit(1);
  }

  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  const outputPath = path.join(__dirname, '..', `${slug}.md`);

  if (fs.existsSync(outputPath)) {
    console.error(`❌ File "${slug}.md" already exists.`);
    console.log('Use a different slug or remove the existing file.');
    process.exit(1);
  }

  // Read template
  let content = fs.readFileSync(templatePath, 'utf-8');

  // Replace placeholders
  content = content.replace(/\[Post Title\]/g, title);
  content = content.replace(/\[Title\]/g, title);
  content = content.replace(/\[Project Name\]/g, title);
  content = content.replace(/\[API Tutorial Title\]/g, title);

  // Update date if present
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(/YYYY-MM-DD/g, today);

  // Write to output file
  fs.writeFileSync(outputPath, content, 'utf-8');

  console.log(`\n✅ Post created: ${slug}.md`);
  console.log(`📝 Template: ${templateName}`);
  console.log(`📄 Output: ${outputPath}`);
  console.log('\nNext steps:');
  console.log('  1. Edit the file to add your content');
  console.log('  2. Create an insert script (based on insert-first-post.js)');
  console.log('  3. Run: node scripts/insert-post.js ' + slug + '.md');
}

// Main
if (process.argv.length < 4) {
  showUsage();
  process.exit(1);
}

const [,, template, slug, title] = process.argv;

createPost(template, slug, title);
