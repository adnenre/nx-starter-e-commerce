#!/bin/bash
set -e

echo "🧹 Removing Nx / TS / build caches..."
rm -rf node_modules dist .nx .turbo tsconfig.tsbuildinfo
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

echo "📦 Installing dependencies (frozen lockfile)..."
pnpm install --frozen-lockfile

echo "🔄 Resetting Nx cache..."
pnpm exec nx reset

echo "🔍 Running typecheck (fail on error)..."
pnpm exec nx run-many -t typecheck --skip-nx-cache

echo "🧪 Running tests..."
pnpm exec nx run-many -t test --skip-nx-cache

echo "🏗️ Running builds..."
pnpm exec nx run-many -t build --skip-nx-cache

echo "✅ All CI checks passed locally!"