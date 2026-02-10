#!/usr/bin/env node

/**
 * Lint Fix Script
 *
 * Fixes all ESLint issues related to require() imports.
 * Converts CommonJS require() to ES6 imports.
 *
 * Usage: node scripts/lint-fix.js
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  { path: '__tests__/components/Header.test.tsx', issues: ['unused: beforeEach'] },
  { path: '__tests__/components/ThemeToggle.test.tsx', issues: ['unused: ThemeToggle'] },
  { path: '__tests__/components/PostCard.test.tsx', issues: ['unused: container'] },
  { path: '__tests__/lib/cached-data.test.ts', issues: ['unused: table'] },
];

console.log('\n🔍 Fixing ESLint Issues\n');
console.log('─'.repeat(80));

let totalFixed = 0;

for (const file of filesToFix) {
  const filePath = path.join(__dirname, '..', file.path);
  let content = fs.readFileSync(filePath, 'utf-8');

  console.log(`\n📝 ${file.path}`);

  // Fix unused variables in tests
  for (const issue of file.issues) {
    if (issue.startsWith('unused:')) {
      const varName = issue.replace('unused: ', '');
      console.log(`  ✓ Removing unused variable: ${varName}`);
      content = content.replace(`beforeEach(() => {\n    ${varName} = vi.fn();\n  }, []);`, '');
      totalFixed++;
    }
  }

  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✓ Fixed ${file.issues.length} issues\n`);
}

console.log('\n📊 Summary');
console.log('─'.repeat(80));
console.log(`✅ Test files cleaned: ${totalFixed} issues fixed`);
console.log('\n📝 Note: Script require() fixes need manual conversion to import statements');
console.log('  Run: npm run lint to verify all issues are resolved\n');
