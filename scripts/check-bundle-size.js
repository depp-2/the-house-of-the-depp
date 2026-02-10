#!/usr/bin/env node

/**
 * Check Bundle Size
 *
 * Usage: node scripts/check-bundle-size.js
 *
 * This script analyzes the .next/static/chunks directory and reports
 * the size of JavaScript bundles.
 */

const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../.next/static/chunks');
const JS_THRESHOLD = 200; // Warning threshold in KB
const GZIP_COMPRESSION = 0.6; // Estimated gzip compression ratio

/**
 * Get file size in KB
 */
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size / 1024;
}

/**
 * Format file size for display
 */
function formatSize(sizeKB) {
  if (sizeKB < 1) {
    return `${(sizeKB * 1024).toFixed(2)} B`;
  } else if (sizeKB < 1024) {
    return `${sizeKB.toFixed(2)} KB`;
  } else {
    return `${(sizeKB / 1024).toFixed(2)} MB`;
  }
}

/**
 * Analyze bundle chunks
 */
function analyzeBundles() {
  if (!fs.existsSync(CHUNKS_DIR)) {
    console.log('\n❌ .next/static/chunks directory not found.');
    console.log('Run `npm run build` first to generate the bundle.\n');
    process.exit(1);
  }

  const files = fs.readdirSync(CHUNKS_DIR)
    .filter(file => file.endsWith('.js') && !file.includes('node_modules'));

  console.log('\n📦 Bundle Size Analysis\n');
  console.log('─'.repeat(80));

  let totalSize = 0;
  let largeBundles = 0;

  const results = files.map(file => {
    const filePath = path.join(CHUNKS_DIR, file);
    const size = getFileSize(filePath);
    const gzippedSize = size * GZIP_COMPRESSION;
    totalSize += size;

    const isLarge = size > JS_THRESHOLD;
    if (isLarge) largeBundles++;

    return {
      file,
      size,
      gzippedSize,
      isLarge,
    };
  })
  .sort((a, b) => b.size - a.size) // Sort by size (largest first)
  .slice(0, 20); // Show top 20 largest chunks

  // Display results
  results.forEach(({ file, size, gzippedSize, isLarge }) => {
    const status = isLarge ? '🔴' : '🟢';
    const fileName = file.padEnd(30);
    const sizeStr = formatSize(size).padEnd(12);
    const gzipStr = `~${formatSize(gzippedSize)}`;

    console.log(`${status} ${fileName} ${sizeStr} (gzip: ${gzipStr})`);
  });

  console.log('─'.repeat(80));

  // Summary
  console.log('\n📊 Summary');
  console.log('─'.repeat(80));
  console.log(`Total chunks analyzed: ${files.length}`);
  console.log(`Total bundle size: ${formatSize(totalSize)}`);
  console.log(`Total gzipped (est): ${formatSize(totalSize * GZIP_COMPRESSION)}`);
  console.log(`Large bundles (>${JS_THRESHOLD}KB): ${largeBundles}`);

  // Recommendations
  if (largeBundles > 0) {
    console.log('\n💡 Recommendations');
    console.log('─'.repeat(80));

    if (largeBundles > 0) {
      console.log('• Consider code splitting for large bundles');
      console.log('• Use dynamic imports for non-critical code');
      console.log('• Remove unused dependencies');
    }

    console.log('• Run `npm run analyze` for detailed bundle visualization');
    console.log('• Consider lazy-loading routes or components');
  } else {
    console.log('\n✅ Bundle sizes are within acceptable limits!');
  }
}

// Main
try {
  analyzeBundles();
} catch (error) {
  console.error('\n❌ Error analyzing bundles:', error.message);
  process.exit(1);
}
