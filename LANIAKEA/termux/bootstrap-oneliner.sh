#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  LANIAKEA — Intelligent Cross-Device Bootstrap v3.1
#  Fixed for ARM64/Termux with esbuild compatibility
# ============================================================

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ============================================================
# DEVICE & ENVIRONMENT DETECTION
# ============================================================

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
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

detect_network_interface() {
    local PLATFORM=$1
    
    case "$PLATFORM" in
        termux)
            if command -v ifconfig &> /dev/null; then
                ifconfig | grep -oP 'inet \K[0-9.]+(?= netmask)' | head -1 || echo "127.0.0.1"
            else
                echo "127.0.0.1"
            fi
            ;;
        macos)
            ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1 || echo "127.0.0.1"
            ;;
        wsl|linux)
            if command -v ip &> /dev/null; then
                ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' || \
                ip addr show 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d'/' -f1 | head -1 || echo "127.0.0.1"
            elif command -v hostname &> /dev/null; then
                hostname -I 2>/dev/null | awk '{print $1}' || echo "127.0.0.1"
            else
                echo "127.0.0.1"
            fi
            ;;
        *)
            echo "127.0.0.1"
            ;;
    esac
}

detect_available_port() {
    local BASE_PORT=${1:-3000}
    local PLATFORM=$2
    
    if [[ "$PLATFORM" == "termux" ]]; then
        for port in $BASE_PORT 3001 3002 8000 8001 8080; do
            if ! grep -q ":$port " /proc/net/tcp 2>/dev/null; then
                echo $port
                return
            fi
        done
    else
        if command -v lsof &> /dev/null; then
            if ! lsof -Pi :$BASE_PORT -sTCP:LISTEN -t &> /dev/null; then
                echo $BASE_PORT
                return
            fi
        elif command -v netstat &> /dev/null; then
            if ! netstat -tln 2>/dev/null | grep -q ":$BASE_PORT "; then
                echo $BASE_PORT
                return
            fi
        fi
    fi
    
    echo $BASE_PORT
}

# ============================================================
# INSTALLATION & SETUP
# ============================================================

install_dependencies() {
    local PLATFORM=$1
    
    case "$PLATFORM" in
        termux)
            pkg update -y && pkg install -y nodejs git curl build-essential python
            ;;
        macos)
            if ! command -v brew &> /dev/null; then
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            brew install node git
            ;;
        linux|wsl)
            sudo apt-get update 2>/dev/null || apt-get update
            sudo apt-get install -y nodejs npm git curl build-essential python3 2>/dev/null || apt-get install -y nodejs npm git curl build-essential python3
            ;;
    esac
    
    npm install -g pnpm
}

# ============================================================
# MAIN EXECUTION
# ============================================================

# Detect environment
PLATFORM=$(detect_platform)
LOCAL_IP=$(detect_network_interface "$PLATFORM")
PORT=$(detect_available_port 3000 "$PLATFORM")

echo "╔════════════════════════════════════════════════════════╗"
echo "║   LANIAKEA — INTELLIGENT CROSS-DEVICE BOOTSTRAP v3.1  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Platform: $PLATFORM"
echo "IP: $LOCAL_IP"
echo "Port: $PORT"
echo ""

# Install dependencies
pkg update -y 2>/dev/null || true
pkg install -y nodejs git curl build-essential python 2>/dev/null || true
npm install -g pnpm 2>/dev/null || true

# Clone or update repository
([ -d "$HOME/sovereign-interface" ] && cd "$HOME/sovereign-interface" && git pull || git clone https://github.com/shalominattii-us/SOVEREIGN-INTERFACE-.git "$HOME/sovereign-interface")

cd "$HOME/sovereign-interface/LANIAKEA"

# Fix for Termux ARM64: Clear esbuild cache and rebuild from source
if [ "$PLATFORM" = "termux" ]; then
    echo ""
    echo "━━ Fixing esbuild for ARM64 Termux..."
    rm -rf node_modules/.pnpm/@esbuild* 2>/dev/null || true
    rm -rf node_modules/esbuild 2>/dev/null || true
fi

# Install with build from source for ARM64
echo ""
echo "━━ Installing dependencies (building from source)..."
pnpm install --ignore-scripts --no-frozen-lockfile

# Force rebuild of esbuild
echo ""
echo "━━ Building esbuild..."
if [ "$PLATFORM" = "termux" ]; then
    npm rebuild esbuild --build-from-source 2>&1 | tail -20 || true
fi

# Build project
echo ""
echo "━━ Building LANIAKEA..."
pnpm build

# Setup environment
mkdir -p "$HOME/.laniakea"
cat > .env << EOF
PLATFORM=$PLATFORM
EXPO_PUBLIC_API_BASE_URL=http://${LOCAL_IP}:${PORT}
NODE_ENV=production
PORT=${PORT}
EOF

# Print diagnostics
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║            LANIAKEA — BUILD SUCCESSFUL ✓              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "System Information:"
echo "  Platform       : $PLATFORM"
echo "  API URL        : http://${LOCAL_IP}:${PORT}"
echo ""
echo "Starting server on port $PORT..."
echo ""

# Start server
NODE_ENV=production PORT=$PORT node dist/index.js
