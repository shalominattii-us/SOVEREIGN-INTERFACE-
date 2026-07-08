#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  LANIAKEA — Intelligent Cross-Device Bootstrap v3.0
#  Auto-detects OS, device type, network, and capabilities
#  Works seamlessly on Termux, macOS, Linux, WSL, Windows
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

detect_device_type() {
    if [ -f /sys/devices/virtual/dmi/id/sys_vendor ]; then
        VENDOR=$(cat /sys/devices/virtual/dmi/id/sys_vendor 2>/dev/null || echo "")
        if [[ "$VENDOR" =~ "VMware" ]] || [[ "$VENDOR" =~ "VirtualBox" ]]; then
            echo "vm"
        elif [[ "$VENDOR" =~ "QEMU" ]]; then
            echo "qemu"
        else
            echo "physical"
        fi
    elif [[ "$(uname -s)" == "Darwin" ]]; then
        if sysctl -n hw.model 2>/dev/null | grep -q "MacBook\|Mac"; then
            echo "laptop"
        else
            echo "desktop"
        fi
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

detect_system_resources() {
    local PLATFORM=$1
    
    if [[ "$PLATFORM" == "termux" ]]; then
        FREE_MEM=$(grep MemAvailable /proc/meminfo | awk '{print $2}')
        CORES=$(nproc 2>/dev/null || echo "1")
    else
        if [[ "$PLATFORM" == "macos" ]]; then
            FREE_MEM=$(vm_stat | grep "Pages free" | awk '{print $3}' | tr -d '.' | awk '{printf "%.0f\n", $1 * 4096 / 1024}')
            CORES=$(sysctl -n hw.ncpu)
        else
            FREE_MEM=$(grep MemAvailable /proc/meminfo 2>/dev/null | awk '{print $2}' || echo "0")
            CORES=$(nproc 2>/dev/null || echo "1")
        fi
    fi
    
    echo "${FREE_MEM}:${CORES}"
}

optimize_build_config() {
    local RESOURCES=$1
    local MEMORY=$(echo $RESOURCES | cut -d: -f1)
    local CORES=$(echo $RESOURCES | cut -d: -f2)
    
    if (( MEMORY < 1000000 )); then
        echo "--max-workers=1"
    elif (( MEMORY < 2000000 )); then
        echo "--max-workers=2"
    else
        echo "--max-workers=$CORES"
    fi
}

# ============================================================
# INSTALLATION & SETUP
# ============================================================

install_dependencies() {
    local PLATFORM=$1
    
    case "$PLATFORM" in
        termux)
            pkg update -y && pkg install -y nodejs git curl build-essential
            ;;
        macos)
            if ! command -v brew &> /dev/null; then
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            brew install node git
            ;;
        linux|wsl)
            sudo apt-get update 2>/dev/null || apt-get update
            sudo apt-get install -y nodejs npm git curl build-essential 2>/dev/null || apt-get install -y nodejs npm git curl build-essential
            ;;
    esac
    
    npm install -g pnpm
}

# ============================================================
# MAIN EXECUTION
# ============================================================

# Detect environment
PLATFORM=$(detect_platform)
DEVICE_TYPE=$(detect_device_type)
LOCAL_IP=$(detect_network_interface "$PLATFORM")
PORT=$(detect_available_port 3000 "$PLATFORM")
RESOURCES=$(detect_system_resources "$PLATFORM")
BUILD_FLAGS=$(optimize_build_config "$RESOURCES")

# Install dependencies
pkg update -y 2>/dev/null || true
pkg install -y nodejs git curl 2>/dev/null || true
npm install -g pnpm 2>/dev/null || true

# Clone or update repository
([ -d "$HOME/sovereign-interface" ] && cd "$HOME/sovereign-interface" && git pull || git clone https://github.com/shalominattii-us/SOVEREIGN-INTERFACE-.git "$HOME/sovereign-interface")

# Build project
cd "$HOME/sovereign-interface/LANIAKEA"
pnpm install --ignore-scripts
pnpm build $BUILD_FLAGS

# Setup environment
cat > .env << EOF
PLATFORM=$PLATFORM
DEVICE_TYPE=$DEVICE_TYPE
EXPO_PUBLIC_API_BASE_URL=http://${LOCAL_IP}:${PORT}
NODE_ENV=production
PORT=${PORT}
EOF

# Print diagnostics
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   LANIAKEA — INTELLIGENT CROSS-DEVICE BOOTSTRAP v3.0  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "System Information:"
echo "  Platform       : $PLATFORM"
echo "  Device Type    : $DEVICE_TYPE"
echo "  API URL        : http://${LOCAL_IP}:${PORT}"
echo ""
echo "Environment Variable:"
echo "  EXPO_PUBLIC_API_BASE_URL=http://${LOCAL_IP}:${PORT}"
echo ""

# Start server
NODE_ENV=production PORT=$PORT node dist/index.js
