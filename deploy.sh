#!/bin/bash
# BioHub Deploy Script
# Deploys to a versioned subdirectory to bypass Tencent CloudBase CDN cache
# Usage: ./deploy.sh [version]   (default: uses timestamp)

set -e

VERSION=${1:-$(date +%s)}
ENV_ID="shang-8goyccjf880e83cb"
DEPLOY_DIR="/tmp/biohub-deploy"
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION_DIR="v${VERSION}"

echo "🚀 Deploying BioHub v${VERSION}..."

# 1. Clean & copy app files into versioned subdirectory
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR/${VERSION_DIR}"
rsync -av --exclude='.git' --exclude='node_modules' --exclude='.gitignore' \
  --exclude='cloudbaserc.json' --exclude='deploy.sh' \
  "$SRC_DIR/" "$DEPLOY_DIR/${VERSION_DIR}/"

# 2. Create root redirect to versioned directory
cat > "$DEPLOY_DIR/index.html" << EOF
<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="refresh" content="0;url=/${VERSION_DIR}/index.html">
<script>window.location.replace('/${VERSION_DIR}/index.html' + window.location.hash);</script>
</head><body></body></html>
EOF

# 3. Delete old files & deploy
echo "🗑️  Deleting old files from CloudBase..."
tcb hosting delete / -e "$ENV_ID" -d

echo "📤 Uploading to CloudBase..."
tcb hosting deploy "$DEPLOY_DIR" -e "$ENV_ID"

# 4. Cleanup
rm -rf "$DEPLOY_DIR"

echo "✅ Deployed to https://${ENV_ID}-1400793383.tcloudbaseapp.com"
echo "   Version: ${VERSION_DIR}"
echo "   Direct: https://${ENV_ID}-1400793383.tcloudbaseapp.com/${VERSION_DIR}/index.html"
