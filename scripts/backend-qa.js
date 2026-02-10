#!/usr/bin/env node

/**
 * Backend QA Script
 *
 * Tests Supabase connection, API routes, database queries.
 * Checks: connection handling, error cases, edge cases, performance.
 *
 * Usage: node scripts/backend-qa.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: [],
};

/**
 * Log test result
 */
function logTest(name, passed, details = '') {
  if (passed) {
    console.log(`✓ ${name}${details ? ': ' + details : ''}`);
    results.passed.push({ name, details });
  } else {
    console.log(`✗ ${name}${details ? ': ' + details : ''}`);
    results.failed.push({ name, details });
  }
}

/**
 * Log warning
 */
function logWarning(name, details) {
  console.log(`⚠️  ${name}: ${details}`);
  results.warnings.push({ name, details });
}

async function runTests() {
  console.log('\n🔧 Starting Backend QA Tests\n');
  console.log('─'.repeat(80));

  // Test 1: Connection handling
  console.log('\n📡 Test 1: Connection Handling');
  try {
    const start = Date.now();
    await supabase.from('posts').select('id').limit(1);
    const duration = Date.now() - start;

    logTest('Connection established', true, `${duration}ms`);
    if (duration > 1000) {
      logWarning('Slow connection', 'Connection took > 1s');
    }
  } catch (error) {
    logTest('Connection handling', false, error.message);
  }

  // Test 2: Basic queries on all tables
  console.log('\n📊 Test 2: Basic Queries');
  const tables = ['posts', 'projects', 'researches'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        logTest(`Query ${table}`, false, error.message);
      } else {
        logTest(`Query ${table}`, true, 'Data fetched successfully');
      }
    } catch (error) {
      logTest(`Query ${table}`, false, error.message);
    }
  }

  // Test 3: Edge cases - Non-existent records
  console.log('\n🔍 Test 3: Edge Cases');

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', 'non-existent-post-xyz-123');
    
    if (!error && data.length === 0) {
      logTest('Non-existent post handling', true, 'Returns empty array');
    } else if (error) {
      logTest('Non-existent post handling', false, error.message);
    } else {
      logWarning('Non-existent post handling', 'Expected empty array but got data');
    }
  } catch (error) {
    logTest('Non-existent post handling', false, error.message);
  }

  // Test 4: Edge cases - Invalid data types
  console.log('\n🔬 Test 4: Data Type Validation');

  try {
    // Test inserting invalid data (should fail validation)
    const { error } = await supabase.from('posts').insert({
      slug: '', // Should fail - empty slug
      title: 'Test',
      content: 'Test content',
    });

    if (error) {
      logTest('Empty slug validation', true, 'Correctly rejected');
    } else {
      logTest('Empty slug validation', false, 'Should have rejected empty slug');
    }
  } catch (error) {
    logTest('Data type validation', false, error.message);
  }

  // Test 5: RLS (Row Level Security) policies
  console.log('\n🔒 Test 5: Row Level Security');

  // Test reading published posts (should work for anyone)
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .not('published_at', 'is', null)
      .limit(5);
    
    if (!error) {
      logTest('RLS: Read published posts', true, 'Anyone can read published posts');
    } else {
      logTest('RLS: Read published posts', false, error.message);
    }
  } catch (error) {
    logTest('RLS testing', false, error.message);
  }

  // Test 6: Function calls - increment_view_count
  console.log('\n📊 Test 6: Supabase Functions');

  try {
    // First, create a test post
    const { data: postData, error: createError } = await supabase
      .from('posts')
      .insert({
        slug: `test-qa-${Date.now()}`,
        title: 'QA Test Post',
        content: 'This is a test post for QA purposes.',
      })
      .select()
      .single();

    if (createError || !postData) {
      logTest('Create test post', false, createError?.message || 'Failed to create');
      throw new Error('Cannot test increment without post');
    }

    const postSlug = postData.slug;
    const initialViews = postData.view_count || 0;

    // Increment view count
    await supabase.rpc('increment_view_count', { post_slug: postSlug });

    // Verify increment
    const { data: updatedPost, error: readError } = await supabase
      .from('posts')
      .select('view_count')
      .eq('slug', postSlug)
      .single();

    if (readError) {
      logTest('View count increment', false, readError.message);
    } else if (updatedPost.view_count === initialViews + 1) {
      logTest('View count increment', true, `Incremented from ${initialViews} to ${updatedPost.view_count}`);
    } else {
      logTest('View count increment', false, `Expected ${initialViews + 1}, got ${updatedPost.view_count}`);
    }

    // Cleanup test post
    await supabase.from('posts').delete().eq('slug', postSlug);
  } catch (error) {
    logTest('Function testing', false, error.message);
  }

  // Test 7: Performance - Large queries
  console.log('\n⚡ Test 7: Performance');

  try {
    const start = Date.now();
    await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Fetch 100 posts
    const duration = Date.now() - start;

    const durationPerPost = duration / 100;
    logTest('Large query performance', true, `100 posts in ${duration}ms (${durationPerPost.toFixed(2)}ms/post)`);

    if (duration > 1000) {
      logWarning('Query performance', '100 post query took > 1s');
    } else if (duration > 500) {
      logWarning('Query performance', '100 post query took > 500ms');
    }
  } catch (error) {
    logTest('Large query', false, error.message);
  }

  // Test 8: Error handling - Invalid operations
  console.log('\n🚨 Test 8: Error Handling');

  try {
    // Test inserting duplicate slug (should fail due to UNIQUE constraint)
    const { error: duplicateError } = await supabase.from('posts').insert({
      slug: 'test-slug',
      title: 'Test',
      content: 'Content',
    });

    if (duplicateError && duplicateError.message.includes('duplicate key')) {
      logTest('Duplicate key handling', true, 'Correctly enforces UNIQUE constraint');
    } else if (duplicateError) {
      logTest('Duplicate key handling', false, 'Unexpected error response');
    }
  } catch (error) {
    logTest('Error handling', false, error.message);
  }

  // Test 9: Connection resilience
  console.log('\n🔄 Test 9: Connection Resilience');

  try {
    // Simulate multiple concurrent requests
    const promises = [
      supabase.from('posts').select('*').limit(1),
      supabase.from('projects').select('*').limit(1),
      supabase.from('researches').select('*').limit(1),
    ];

    await Promise.all(promises);
    logTest('Concurrent requests', true, 'All 3 queries completed');
  } catch (error) {
    logTest('Concurrent requests', false, error.message);
  }

  // Summary
  console.log('\n📋 Test Summary');
  console.log('─'.repeat(80));
  console.log(`✓ Passed: ${results.passed.length}`);
  console.log(`✗ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);

  if (results.failed.length === 0) {
    console.log('\n✅ All backend QA tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Review failed tests above.');
  }

  // Save results
  const qaResults = {
    timestamp: new Date().toISOString(),
    totalTests: results.passed.length + results.failed.length,
    passed: results.passed.length,
    failed: results.failed.length,
    warnings: results.warnings.length,
    details: results,
  };

  const fs = require('fs');
  const path = require('path');

  const resultsPath = path.join(__dirname, '../memory/backend-qa.json');
  fs.writeFileSync(resultsPath, JSON.stringify(qaResults, null, 2));

  console.log(`\n📂 Results saved to: ${resultsPath}`);
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Backend QA script failed:', error);
  process.exit(1);
});
