#!/bin/bash
# ============================================================
#  LANIAKEA — Intelligent Cross-Device Bootstrap v3.0
#  Auto-detects OS, device type, network, and capabilities
# ============================================================

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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
            # Termux-specific network detection
            if command -v ifconfig &> /dev/null; then
                ifconfig | grep -oP 'inet \K[0-9.]+(?= netmask)' | head -1 || echo "127.0.0.1"
            else
                echo "127.0.0.1"
            fi
            ;;
        macos)
            # macOS network detection
            ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1 || echo "127.0.0.1"
            ;;
        wsl|linux)
            # Linux/WSL network detection with fallbacks
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
        # Termux: check common ports
        for port in $BASE_PORT 3001 3002 8000 8001 8080; do
            if ! grep -q ":$port " /proc/net/tcp 2>/dev/null; then
                echo $port
                return
            fi
        done
    else
        # Unix-like systems
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
    
    # Fallback: default port
    echo $BASE_PORT
}

detect_system_resources() {
    local PLATFORM=$1
    
    if [[ "$PLATFORM" == "termux" ]]; then
        # Termux: get available memory
        FREE_MEM=$(grep MemAvailable /proc/meminfo | awk '{print $2}')
        CORES=$(nproc 2>/dev/null || echo "1")
    else
        # Unix-like systems
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
    
    # Determine optimal build settings
    local BUILD_FLAGS=""
    
    if (( MEMORY < 1000000 )); then
        # Low memory: single threaded
        BUILD_FLAGS="--max-workers=1"
    elif (( MEMORY < 2000000 )); then
        # Medium memory: limit workers
        BUILD_FLAGS="--max-workers=2"
    else
        # High memory: use all cores
        BUILD_FLAGS="--max-workers=$CORES"
    fi
    
    echo "$BUILD_FLAGS"
}

# ============================================================
# INSTALLATION & SETUP
# ============================================================

install_dependencies() {
    local PLATFORM=$1
    
    echo -e "${BLUE}━━ Installing dependencies for $PLATFORM...${NC}"
    
    case "$PLATFORM" in
        termux)
            pkg update -y
            pkg install -y nodejs git curl build-essential
            ;;
        macos)
            if ! command -v brew &> /dev/null; then
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            brew install node git
            ;;
        linux|wsl)
            sudo apt-get update || apt-get update
            sudo apt-get install -y nodejs npm git curl build-essential || apt-get install -y nodejs npm git curl build-essential
            ;;
        *)
            echo -e "${RED}❌ Unsupported platform: $PLATFORM${NC}"
            exit 1
            ;;
    esac
    
    # Install pnpm globally
    npm install -g pnpm
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

clone_or_update_repo() {
    local REPO_URL="https://github.com/shalominattii-us/SOVEREIGN-INTERFACE-.git"
    local REPO_PATH="$HOME/sovereign-interface"
    
    echo -e "${BLUE}━━ Repository setup...${NC}"
    
    if [ -d "$REPO_PATH" ]; then
        echo -e "${CYAN}Repo exists, pulling latest...${NC}"
        cd "$REPO_PATH"
        git pull
    else
        echo -e "${CYAN}Cloning repository...${NC}"
        git clone "$REPO_URL" "$REPO_PATH"
    fi
    
    echo -e "${GREEN}✅ Repository ready${NC}"
}

build_project() {
    local BUILD_FLAGS=$1
    
    echo -e "${BLUE}━━ Building project...${NC}"
    
    cd "$HOME/sovereign-interface/LANIAKEA"
    pnpm install --ignore-scripts
    pnpm build $BUILD_FLAGS
    
    echo -e "${GREEN}✅ Build complete${NC}"
}

# ============================================================
# ENVIRONMENT CONFIGURATION
# ============================================================

setup_environment() {
    local PLATFORM=$1
    local LOCAL_IP=$2
    local PORT=$3
    local DEVICE_TYPE=$4
    
    echo -e "${BLUE}━━ Setting up environment...${NC}"
    
    # Create .env file
    cat > "$HOME/sovereign-interface/LANIAKEA/.env" << EOF
# Auto-generated by intelligent bootstrap
PLATFORM=$PLATFORM
DEVICE_TYPE=$DEVICE_TYPE
EXPO_PUBLIC_API_BASE_URL=http://${LOCAL_IP}:${PORT}
NODE_ENV=production
PORT=${PORT}
LOG_LEVEL=info
EOF
    
    # Platform-specific configuration
    case "$PLATFORM" in
        termux)
            echo "TERMUX_ENV=true" >> .env
            ;;
        wsl)
            echo "WSL_ENV=true" >> .env
            ;;
        macos)
            echo "MACOS_ENV=true" >> .env
            ;;
    esac
    
    echo -e "${GREEN}✅ Environment configured${NC}"
}

# ============================================================
# DIAGNOSTICS
# ============================================================

print_diagnostics() {
    local PLATFORM=$1
    local DEVICE_TYPE=$2
    local LOCAL_IP=$3
    local PORT=$4
    local RESOURCES=$5
    
    local MEMORY=$(echo $RESOURCES | cut -d: -f1)
    local CORES=$(echo $RESOURCES | cut -d: -f2)
    
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   LANIAKEA — INTELLIGENT CROSS-DEVICE BOOTSTRAP v3.0  ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}System Information:${NC}"
    echo -e "  Platform       : ${GREEN}${PLATFORM}${NC}"
    echo -e "  Device Type    : ${GREEN}${DEVICE_TYPE}${NC}"
    echo -e "  Memory         : ${GREEN}$(( MEMORY / 1024 )) MB${NC}"
    echo -e "  CPU Cores      : ${GREEN}${CORES}${NC}"
    echo ""
    echo -e "${BLUE}Network Configuration:${NC}"
    echo -e "  Local IP       : ${GREEN}${LOCAL_IP}${NC}"
    echo -e "  Port           : ${GREEN}${PORT}${NC}"
    echo -e "  API URL        : ${CYAN}http://${LOCAL_IP}:${PORT}${NC}"
    echo ""
    echo -e "${BLUE}Usage:${NC}"
    echo -e "  Local          : ${CYAN}http://127.0.0.1:${PORT}${NC}"
    echo -e "  Remote         : ${CYAN}http://${LOCAL_IP}:${PORT}${NC}"
    echo ""
    echo -e "${YELLOW}Environment Variable:${NC}"
    echo -e "  ${CYAN}EXPO_PUBLIC_API_BASE_URL=http://${LOCAL_IP}:${PORT}${NC}"
    echo ""
}

# ============================================================
# MAIN EXECUTION
# ============================================================

main() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   LANIAKEA — INTELLIGENT BOOTSTRAP INITIALIZING...    ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Detection phase
    echo -e "${BLUE}━━ PHASE 0: Environment Detection${NC}"
    PLATFORM=$(detect_platform)
    DEVICE_TYPE=$(detect_device_type)
    LOCAL_IP=$(detect_network_interface "$PLATFORM")
    PORT=$(detect_available_port 3000 "$PLATFORM")
    RESOURCES=$(detect_system_resources "$PLATFORM")
    BUILD_FLAGS=$(optimize_build_config "$RESOURCES")
    
    echo -e "${GREEN}✓ Platform       : $PLATFORM${NC}"
    echo -e "${GREEN}✓ Device Type    : $DEVICE_TYPE${NC}"
    echo -e "${GREEN}✓ Network IP     : $LOCAL_IP${NC}"
    echo -e "${GREEN}✓ Available Port : $PORT${NC}"
    
    # Installation phase
    echo ""
    echo -e "${BLUE}━━ PHASE 1: Dependency Installation${NC}"
    install_dependencies "$PLATFORM"
    
    # Repository phase
    echo ""
    echo -e "${BLUE}━━ PHASE 2: Repository Setup${NC}"
    clone_or_update_repo
    
    # Build phase
    echo ""
    echo -e "${BLUE}━━ PHASE 3: Project Build${NC}"
    build_project "$BUILD_FLAGS"
    
    # Configuration phase
    echo ""
    echo -e "${BLUE}━━ PHASE 4: Environment Configuration${NC}"
    setup_environment "$PLATFORM" "$LOCAL_IP" "$PORT" "$DEVICE_TYPE"
    
    # Diagnostics
    echo ""
    print_diagnostics "$PLATFORM" "$DEVICE_TYPE" "$LOCAL_IP" "$PORT" "$RESOURCES"
    
    # Start server
    echo -e "${BLUE}━━ PHASE 5: Starting LANIAKEA Server${NC}"
    echo -e "${YELLOW}Starting on ${LOCAL_IP}:${PORT}...${NC}"
    echo ""
    
    cd "$HOME/sovereign-interface/LANIAKEA"
    PORT=$PORT NODE_ENV=production node dist/index.js
}

# Run main
main "$@"
