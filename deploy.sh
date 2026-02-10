#!/bin/bash
# BioHub Deploy Script
# Adds cache-busting version params to all ES module imports before deploying to Tencent CloudBase
# Usage: ./deploy.sh [version]   (default: uses timestamp)

set -e

VERSION=${1:-$(date +%s)}
ENV_ID="shang-8goyccjf880e83cb"
DEPLOY_DIR="/tmp/biohub-deploy"
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Deploying BioHub v${VERSION}..."

# 1. Clean & copy
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
rsync -av --exclude='.git' --exclude='node_modules' --exclude='.gitignore' --exclude='cloudbaserc.json' --exclude='deploy.sh' "$SRC_DIR/" "$DEPLOY_DIR/"

# 2. Add ?v= to all JS import paths
echo "📦 Adding cache-busting version v=${VERSION} to imports..."
find "$DEPLOY_DIR/js" -name "*.js" -exec sed -i '' "s/from '\(.*\)\.js'/from '\1.js?v=${VERSION}'/g" {} \;
find "$DEPLOY_DIR/js" -name "*.js" -exec sed -i '' "s/from \"\(.*\)\.js\"/from \"\1.js?v=${VERSION}\"/g" {} \;

# 3. Update CSS/JS references in index.html
sed -i '' "s/\.css?v=[^\"']*/\.css?v=${VERSION}/g" "$DEPLOY_DIR/index.html"
sed -i '' "s/\.js?v=[^\"']*/\.js?v=${VERSION}/g" "$DEPLOY_DIR/index.html"

# 4. Delete old files & deploy
echo "🗑️  Deleting old files from CloudBase..."
tcb hosting delete / -e "$ENV_ID" -d

echo "📤 Uploading to CloudBase..."
tcb hosting deploy "$DEPLOY_DIR" -e "$ENV_ID"

# 5. Cleanup
rm -rf "$DEPLOY_DIR"

echo "✅ Deployed to https://${ENV_ID}-1400793383.tcloudbaseapp.com"
echo "   Version: v${VERSION}"
