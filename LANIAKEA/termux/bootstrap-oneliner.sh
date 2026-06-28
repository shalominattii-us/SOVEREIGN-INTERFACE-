#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
#  LANIAKEA — One-liner Bootstrap (paste into Termux)
#  This does everything: install deps, clone, build, start
# ============================================================

pkg update -y && pkg install -y nodejs git curl && \
npm install -g pnpm && \
([ -d "$HOME/sovereign-interface" ] && cd "$HOME/sovereign-interface" && git pull || git clone https://github.com/shalominattii-us/SOVEREIGN-INTERFACE-.git "$HOME/sovereign-interface") && \
cd "$HOME/sovereign-interface/LANIAKEA" && \
pnpm install --ignore-scripts && \
pnpm build && \
LOCAL_IP=$(ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' || hostname -I | awk '{print $1}') && \
echo "EXPO_PUBLIC_API_BASE_URL=http://${LOCAL_IP}:3000" > .env && \
echo "" && \
echo "✅ Build complete! Starting Laniakea backend on port 3000..." && \
echo "   API URL: http://${LOCAL_IP}:3000" && \
echo "" && \
NODE_ENV=production node dist/index.js
