#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  LANIAKEA — Termux Bootstrap v3.2
#  Skips esbuild compilation, runs TypeScript directly with tsx
# ============================================================

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

detect_platform() {
    if [ -d "/data/data/com.termux" ]; then
        echo "termux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if grep -qi microsoft /proc/version 2>/dev/null; then
            echo "wsl"
        else
            echo "linux"
        fi
    else
        echo "linux"
    fi
}

detect_network_interface() {
    local PLATFORM=$1
    
    case "$PLATFORM" in
        termux)
            ifconfig 2>/dev/null | grep -oP 'inet \K[0-9.]+(?= netmask)' | head -1 || echo "127.0.0.1"
            ;;
        macos)
            ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1 || echo "127.0.0.1"
            ;;
        *)
            ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' || ip addr show 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d'/' -f1 | head -1 || echo "127.0.0.1"
            ;;
    esac
}

detect_available_port() {
    local BASE_PORT=${1:-3000}
    
    for port in $BASE_PORT 3001 3002 8000 8001 8080; do
        if ! grep -q ":$port " /proc/net/tcp 2>/dev/null; then
            echo $port
            return
        fi
    done
    
    echo $BASE_PORT
}

# ============================================================
# MAIN EXECUTION
# ============================================================

PLATFORM=$(detect_platform)
LOCAL_IP=$(detect_network_interface "$PLATFORM")
PORT=$(detect_available_port 3000)

echo "╔════════════════════════════════════════════════════════╗"
echo "║   LANIAKEA — TERMUX BOOTSTRAP v3.2                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Platform: $PLATFORM"
echo "IP: $LOCAL_IP"
echo "Port: $PORT"
echo ""

# Install dependencies
echo "━━ Installing system packages..."
pkg update -y >/dev/null 2>&1
pkg install -y nodejs git curl >/dev/null 2>&1
npm install -g pnpm >/dev/null 2>&1

# Clone or update repository
REPO_PATH="$HOME/sovereign-interface"
if [ -d "$REPO_PATH" ]; then
    echo "━━ Updating repository..."
    cd "$REPO_PATH"
    git pull >/dev/null 2>&1
else
    echo "━━ Cloning repository..."
    git clone https://github.com/shalominattii-us/SOVEREIGN-INTERFACE-.git "$REPO_PATH" >/dev/null 2>&1
fi

cd "$REPO_PATH/LANIAKEA"

# Install dependencies without scripts
echo "━━ Installing npm dependencies..."
pnpm install --ignore-scripts >/dev/null 2>&1

# Setup environment
mkdir -p "$HOME/.laniakea"
cat > .env << EOF
PLATFORM=$PLATFORM
EXPO_PUBLIC_API_BASE_URL=http://${LOCAL_IP}:${PORT}
NODE_ENV=production
PORT=${PORT}
EOF

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║            LANIAKEA — READY ✓                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Platform       : $PLATFORM"
echo "API URL        : http://${LOCAL_IP}:${PORT}"
echo ""
echo "Starting server..."
echo ""

# Run directly with tsx (no compilation)
NODE_ENV=production PORT=$PORT npx tsx server/_core/index.ts
