#!/bin/bash
set -e

echo "🧹 Cleaning ALL caches and build outputs..."

# node modules
rm -rf node_modules

# nx / turbo
rm -rf .nx
rm -rf .turbo

# dist folders
rm -rf dist
find . -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true

# vite cache
find . -type d -name ".vite" -exec rm -rf {} + 2>/dev/null || true

# tsbuildinfo
find . -type f -name "*.tsbuildinfo" -delete 2>/dev/null || true

# coverage
find . -type d -name "coverage" -exec rm -rf {} + 2>/dev/null || true

# test output
find . -type d -name "test-output" -exec rm -rf {} + 2>/dev/null || true

echo "🧽 Clearing pnpm store..."
pnpm store prune

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔄 Resetting Nx daemon/cache..."
pnpm exec nx reset

echo "🏗️ Running builds FIRST (like CI)..."
pnpm exec nx run-many -t build --all --skip-nx-cache

echo "🔍 Running typecheck..."
pnpm exec nx run-many -t typecheck --all --skip-nx-cache

echo "🧪 Running tests..."
pnpm exec nx run-many -t test --all --skip-nx-cache

echo "🧹 Running lint..."
pnpm exec nx run-many -t lint --all --skip-nx-cache

echo "✅ Local environment matches CI successfully!"