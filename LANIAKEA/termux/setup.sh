#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  LANIAKEA BACKEND SERVER — Termux Setup & Launch Script
#  Run this once to install everything, then use start.sh
# ============================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   LANIAKEA COMPOSITE METAVERSE — Termux Setup   ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ── 1. Update packages ────────────────────────────────────
echo "[1/6] Updating Termux packages..."
pkg update -y && pkg upgrade -y

# ── 2. Install required packages ─────────────────────────
echo "[2/6] Installing Node.js, git, and tools..."
pkg install -y nodejs git curl

# ── 3. Install pnpm ───────────────────────────────────────
echo "[3/6] Installing pnpm..."
npm install -g pnpm

# ── 4. Clone the repository ───────────────────────────────
echo "[4/6] Cloning SOVEREIGN-INTERFACE repository..."
if [ -d "$HOME/sovereign-interface" ]; then
  echo "  → Repository already exists, pulling latest..."
  cd "$HOME/sovereign-interface"
  git pull origin main
else
  git clone https://github.com/shalominattii-us/SOVEREIGN-INTERFACE-.git "$HOME/sovereign-interface"
  cd "$HOME/sovereign-interface"
fi

# ── 5. Install dependencies ───────────────────────────────
echo "[5/6] Installing Node.js dependencies..."
cd "$HOME/sovereign-interface/LANIAKEA"
pnpm install --ignore-scripts

# ── 6. Build the backend server ───────────────────────────
echo "[6/6] Building the Laniakea backend server..."
pnpm build

# ── Done ──────────────────────────────────────────────────
echo ""
echo "✅  Setup complete!"
echo ""
echo "To start the server, run:"
echo "   bash ~/sovereign-interface/LANIAKEA/termux-start.sh"
echo ""
