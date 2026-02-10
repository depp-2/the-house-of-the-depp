#!/bin/bash

#
# Development Helper Script
#
# Usage: ./scripts/dev-helper.sh [command]
#
# Commands:
#   clean    - Clean cache and dependencies
#   test     - Run tests
#   lint     - Run linter
#   build    - Build the project
#   full     - Run all checks (clean, install, lint, test, build)
#

set -e  # Exit on error

echo "🚀 Development Helper"

case "$1" in
  clean)
    echo "🧹 Cleaning cache..."
    npm run clean 2>/dev/null || ./scripts/clean-cache.sh --deep
    echo "✓ Cache cleaned"
    ;;

  test)
    echo "🧪 Running tests..."
    npm test
    echo "✓ Tests completed"
    ;;

  lint)
    echo "🔍 Running linter..."
    npm run lint
    echo "✓ Linting completed"
    ;;

  build)
    echo "📦 Building project..."
    npm run build
    echo "✓ Build completed"
    ;;

  check)
    echo "🔍 Checking bundle size..."
    node scripts/check-bundle-size.js
    ;;

  full)
    echo "🔄 Running full development check..."
    echo ""
    echo "Step 1: Clean cache..."
    ./scripts/dev-helper.sh clean
    echo ""
    echo "Step 2: Run linter..."
    ./scripts/dev-helper.sh lint
    echo ""
    echo "Step 3: Run tests..."
    ./scripts/dev-helper.sh test
    echo ""
    echo "Step 4: Build project..."
    ./scripts/dev-helper.sh build
    echo ""
    echo "Step 5: Check bundle size..."
    ./scripts/dev-helper.sh check
    echo ""
    echo "✅ Full development check completed!"
    ;;

  *)
    echo "Usage: ./scripts/dev-helper.sh [command]"
    echo ""
    echo "Commands:"
    echo "  clean    - Clean cache and dependencies"
    echo "  test     - Run tests"
    echo "  lint     - Run linter"
    echo "  build    - Build the project"
    echo "  check    - Check bundle size"
    echo "  full     - Run all checks (clean, lint, test, build, check)"
    echo ""
    echo "Example:"
    echo "  ./scripts/dev-helper.sh full"
    exit 1
    ;;
esac
