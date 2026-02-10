#!/bin/bash

#
# Clean Next.js Cache Script
#
# Usage: ./scripts/clean-cache.sh
#

echo "🧹 Cleaning Next.js cache and build artifacts..."

# Remove .next directory
if [ -d ".next" ]; then
  echo "📂 Removing .next directory..."
  rm -rf .next
  echo "✓ .next removed"
else
  echo "ℹ️  No .next directory found"
fi

# Remove node_modules cache
if [ -d "node_modules/.cache" ]; then
  echo "📂 Removing node_modules/.cache..."
  rm -rf node_modules/.cache
  echo "✓ node_modules/.cache removed"
else
  echo "ℹ️  No node_modules/.cache found"
fi

# Clean package-lock if requested
if [ "$1" == "--deep" ]; then
  echo "📂 Deep clean: removing node_modules..."
  rm -rf node_modules
  echo "✓ node_modules removed"
fi

echo ""
echo "✅ Cache cleanup completed!"
echo ""
echo "Next steps:"
echo "  npm install  # (if --deep was used)"
echo "  npm run dev  # Start development server"
