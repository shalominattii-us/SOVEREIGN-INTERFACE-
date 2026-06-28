#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  LANIAKEA — Standalone Server Install (Termux)
#  Uses laniakea-server.js — no TypeScript build needed
# ============================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  LANIAKEA Standalone Server — Termux Installer  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ── Install Node.js ───────────────────────────────────────
echo "[1/4] Installing Node.js..."
pkg update -y && pkg install -y nodejs

# ── Create working directory ──────────────────────────────
echo "[2/4] Creating ~/laniakea directory..."
mkdir -p "$HOME/laniakea"
cd "$HOME/laniakea"

# ── Download the standalone server ───────────────────────
echo "[3/4] Downloading laniakea-server.js from GitHub..."
curl -fsSL \
  "https://raw.githubusercontent.com/shalominattii-us/SOVEREIGN-INTERFACE-/main/LANIAKEA/termux/laniakea-server.js" \
  -o laniakea-server.js 2>/dev/null || {
    echo "  ⚠  Could not download from GitHub. Using local copy if available."
  }

# ── Install npm dependencies ──────────────────────────────
echo "[4/4] Installing dependencies (express, @trpc/server, zod)..."
npm install --save express @trpc/server @trpc/client zod superjson

# ── Done ──────────────────────────────────────────────────
echo ""
echo "✅  Installation complete!"
echo ""
echo "To start the server:"
echo "   node ~/laniakea/laniakea-server.js"
echo ""
echo "Or run in background (keeps running after closing Termux):"
echo "   nohup node ~/laniakea/laniakea-server.js > ~/laniakea/server.log 2>&1 &"
echo "   echo \"Server PID: \$!\""
echo ""
