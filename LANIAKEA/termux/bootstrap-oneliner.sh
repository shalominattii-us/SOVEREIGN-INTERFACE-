#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  LANIAKEA — Termux Bootstrap v3.3
#  Runs TypeScript directly with tsx - no esbuild compilation
# ============================================================

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║   LANIAKEA — TERMUX BOOTSTRAP v3.3                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Detect network
LOCAL_IP=$(ifconfig 2>/dev/null | grep -oP 'inet \K[0-9.]+(?= netmask)' | head -1 || echo "127.0.0.1")
PORT=3000

echo "Platform: termux"
echo "IP: $LOCAL_IP"
echo "Port: $PORT"
echo ""

# Update packages
echo "━━ Updating system packages..."
pkg update -y >/dev/null 2>&1
pkg install -y nodejs git curl >/dev/null 2>&1
npm install -g pnpm >/dev/null 2>&1
echo "✓ System packages ready"

# Clone or update repo
REPO_PATH="$HOME/sovereign-interface"
if [ -d "$REPO_PATH" ]; then
    cd "$REPO_PATH"
    git pull >/dev/null 2>&1
else
    git clone https://github.com/shalominattii-us/SOVEREIGN-INTERFACE-.git "$REPO_PATH" >/dev/null 2>&1
fi

cd "$REPO_PATH/LANIAKEA"
echo "✓ Repository ready"

# Install dependencies (skip build scripts)
echo "━━ Installing dependencies..."
pnpm install --ignore-scripts >/dev/null 2>&1
echo "✓ Dependencies installed"

# Setup .env
cat > .env << EOF
PLATFORM=termux
EXPO_PUBLIC_API_BASE_URL=http://${LOCAL_IP}:${PORT}
NODE_ENV=production
PORT=${PORT}
EOF

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║            LANIAKEA — READY ✓                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Platform       : termux"
echo "API URL        : http://${LOCAL_IP}:${PORT}"
echo ""
echo "Starting server with tsx..."
echo ""

# Run with tsx (no compilation needed)
NODE_ENV=production PORT=$PORT npx tsx server/_core/index.ts
