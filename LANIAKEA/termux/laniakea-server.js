#!/usr/bin/env node
/**
 * LANIAKEA COMPOSITE METAVERSE — Standalone Backend Server
 * =========================================================
 * Pure Node.js / CommonJS — NO build step required.
 * Works directly in Termux with just: node laniakea-server.js
 *
 * Requirements (install once in Termux):
 *   pkg install nodejs
 *   npm install express @trpc/server zod superjson
 */

const express = require("express");
const { initTRPC } = require("@trpc/server");
const { createExpressMiddleware } = require("@trpc/server/adapters/express");
const { z } = require("zod");
const os = require("os");

// ── tRPC setup ────────────────────────────────────────────
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// ── Data generators ───────────────────────────────────────
function getClusters() {
  const now = Date.now();
  return [
    { id: "cluster-1", name: "Primary AWS US-East",       status: "active",  type: "primary",   region: "us-east-1",      provider: "AWS",   nodeCount: 12, cpuUsage: 34, memoryUsage: 52, version: "1.29.0" },
    { id: "cluster-2", name: "Primary Azure EU-West",      status: "active",  type: "primary",   region: "westeurope",     provider: "Azure", nodeCount: 8,  cpuUsage: 28, memoryUsage: 45, version: "1.29.0" },
    { id: "cluster-3", name: "Secondary AWS US-West",      status: "standby", type: "secondary", region: "us-west-2",      provider: "AWS",   nodeCount: 6,  cpuUsage: 12, memoryUsage: 30, version: "1.29.0" },
    { id: "cluster-4", name: "Secondary GCP Asia SE",      status: "standby", type: "secondary", region: "asia-southeast1",provider: "GCP",   nodeCount: 6,  cpuUsage: 10, memoryUsage: 28, version: "1.29.0" },
    { id: "cluster-5", name: "Edge K3s On-Premises",       status: "active",  type: "edge",      region: "on-premises",    provider: "K3s",   nodeCount: 4,  cpuUsage: 55, memoryUsage: 68, version: "1.28.5" },
    { id: "cluster-6", name: "DR AWS EU-Central",          status: "standby", type: "dr",        region: "eu-central-1",   provider: "AWS",   nodeCount: 4,  cpuUsage: 8,  memoryUsage: 22, version: "1.29.0" },
  ];
}

function getServices() {
  return [
    { id: "svc-1", name: "WebXR Gateway",    status: "running",  type: "gateway",  replicas: 3, cpu: 22, memory: 41, uptime: 99.97 },
    { id: "svc-2", name: "Spatial Sync",     status: "running",  type: "sync",     replicas: 5, cpu: 38, memory: 55, uptime: 99.95 },
    { id: "svc-3", name: "Avatar Service",   status: "running",  type: "avatar",   replicas: 4, cpu: 29, memory: 48, uptime: 99.99 },
    { id: "svc-4", name: "World State DB",   status: "running",  type: "database", replicas: 3, cpu: 45, memory: 72, uptime: 100.0 },
  ];
}

function getAlerts() {
  const now = Date.now();
  return [
    { id: "alert-1", severity: "info",    message: "Edge cluster CPU at 55% — within normal range",    service: "Edge K3s",     timestamp: new Date(now - 3600000) },
    { id: "alert-2", severity: "warning", message: "World State DB memory at 72% — monitor closely",   service: "World State DB",timestamp: new Date(now - 7200000) },
    { id: "alert-3", severity: "info",    message: "Spatial Sync replicas scaled to 5 successfully",   service: "Spatial Sync", timestamp: new Date(now - 14400000)},
  ];
}

function getMetrics() {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(now - (23 - i) * 3600000),
    cpu:            20 + Math.random() * 40,
    memory:         35 + Math.random() * 30,
    requestLatency: 80 + Math.random() * 60,
    requestRate:    800 + Math.random() * 400,
    errorRate:      Math.random() * 0.5,
  }));
}

function getLogs() {
  const now = Date.now();
  const levels = ["info", "info", "info", "warn", "error"];
  const services = ["WebXR Gateway", "Spatial Sync", "Avatar Service", "World State DB"];
  const messages = [
    "Request processed successfully",
    "WebSocket connection established",
    "Spatial sync checkpoint completed",
    "Avatar state serialized",
    "Memory usage above 70% threshold",
    "Retry attempt 1/3 for world-state write",
    "Connection timeout — retrying",
  ];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `log-${i + 1}`,
    level:     levels[Math.floor(Math.random() * levels.length)],
    service:   services[Math.floor(Math.random() * services.length)],
    message:   messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date(now - i * 180000),
  }));
}

function getTraces() {
  const now = Date.now();
  const services = ["WebXR Gateway", "Spatial Sync", "Avatar Service"];
  return Array.from({ length: 15 }, (_, i) => ({
    id:        `trace-${i + 1}`,
    service:   services[i % services.length],
    status:    Math.random() > 0.1 ? "success" : "error",
    duration:  50 + Math.random() * 200,
    timestamp: new Date(now - i * 120000),
  }));
}

function getFailoverHistory() {
  const now = Date.now();
  return [
    { id: "fo-1", fromCluster: "Primary AWS US-East", toCluster: "Secondary AWS US-West", status: "completed", duration: 42, timestamp: new Date(now - 86400000 * 14) },
    { id: "fo-2", fromCluster: "Primary Azure EU-West", toCluster: "DR AWS EU-Central",   status: "completed", duration: 38, timestamp: new Date(now - 86400000 * 45) },
  ];
}

function getDeploymentHistory() {
  const now = Date.now();
  const phases = [
    { id: "phase-1", name: "Infrastructure Provisioning",    status: "completed" },
    { id: "phase-2", name: "Cluster Federation",             status: "completed" },
    { id: "phase-3", name: "Service Mesh Installation",      status: "completed" },
    { id: "phase-4", name: "Metaverse Services Deployment",  status: "completed" },
    { id: "phase-5", name: "Observability Stack",            status: "completed" },
  ];
  return [{ id: "deployment-1", phases, status: "completed", timestamp: new Date(now - 86400000 * 5), duration: 18000 }];
}

// ── tRPC Router ───────────────────────────────────────────
const laniakeaRouter = router({
  getDashboardSummary: publicProcedure.query(() => {
    const clusters = getClusters();
    const services = getServices();
    const alerts   = getAlerts();
    const activeClusters  = clusters.filter(c => c.status === "active").length;
    const totalNodes      = clusters.reduce((s, c) => s + c.nodeCount, 0);
    const avgCpuUsage     = Math.round(clusters.reduce((s, c) => s + c.cpuUsage, 0) / clusters.length);
    const avgMemoryUsage  = Math.round(clusters.reduce((s, c) => s + c.memoryUsage, 0) / clusters.length);
    const runningServices = services.filter(s => s.status === "running").length;
    const totalServices   = services.length;
    let overallHealth = "healthy";
    if (avgCpuUsage > 80 || avgMemoryUsage > 80) overallHealth = "critical";
    else if (avgCpuUsage > 70 || avgMemoryUsage > 70) overallHealth = "warning";
    return { overallHealth, activeClusters, totalNodes, avgCpuUsage, avgMemoryUsage, runningServices, totalServices, recentAlerts: alerts.slice(0, 5) };
  }),
  getClusters:    publicProcedure.query(() => getClusters()),
  getCluster:     publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    const c = getClusters().find(c => c.id === input.id);
    if (!c) throw new Error(`Cluster not found: ${input.id}`);
    return c;
  }),
  getServices:    publicProcedure.query(() => getServices()),
  getAlerts:      publicProcedure.query(() => getAlerts()),
  getMetrics:     publicProcedure.query(() => getMetrics()),
  getLogs:        publicProcedure.query(() => getLogs()),
  getTraces:      publicProcedure.query(() => getTraces()),
  getFailoverStatus: publicProcedure.query(() => ({
    primaryCluster:    "Primary AWS US-East",
    secondaryCluster:  "Secondary AWS US-West",
    primaryReadiness:  100,
    secondaryReadiness:98,
    lastFailover:      new Date(Date.now() - 86400000 * 14),
    history:           getFailoverHistory(),
  })),
  initiateFailover: publicProcedure
    .input(z.object({ fromCluster: z.string(), toCluster: z.string() }))
    .mutation(({ input }) => ({
      success: true,
      message: `Failover initiated from ${input.fromCluster} to ${input.toCluster}`,
      estimatedDuration: 300,
      timestamp: new Date(),
    })),
  getDeploymentStatus: publicProcedure.query(() => ({
    currentPhase: "Operational",
    phases: [
      { id: "phase-1", name: "Infrastructure Provisioning",   status: "completed" },
      { id: "phase-2", name: "Cluster Federation",            status: "completed" },
      { id: "phase-3", name: "Service Mesh Installation",     status: "completed" },
      { id: "phase-4", name: "Metaverse Services Deployment", status: "completed" },
      { id: "phase-5", name: "Observability Stack",           status: "completed" },
    ],
    history: getDeploymentHistory(),
  })),
  startDeployment: publicProcedure.mutation(() => ({
    success: true,
    deploymentId: `deployment-${Date.now()}`,
    message: "Deployment pipeline initiated",
    timestamp: new Date(),
  })),
});

const appRouter = router({ laniakea: laniakeaRouter });

// ── Express server ────────────────────────────────────────
const app = express();

// CORS — allow all origins (required for mobile app)
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") { res.sendStatus(200); return; }
  next();
});

app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: Date.now(), service: "laniakea-backend" });
});

// tRPC
app.use("/api/trpc", createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
}));

// ── Start ─────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "3000", 10);

// Get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

app.listen(PORT, "0.0.0.0", () => {
  const localIP = getLocalIP();
  console.log("");
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║   LANIAKEA COMPOSITE METAVERSE — Server Ready   ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("");
  console.log(`  ✅  Server running on port ${PORT}`);
  console.log(`  📱  Local (same device):  http://127.0.0.1:${PORT}`);
  console.log(`  🌐  Network (same WiFi):  http://${localIP}:${PORT}`);
  console.log(`  🔍  Health check:         http://127.0.0.1:${PORT}/api/health`);
  console.log("");
  console.log("  Set EXPO_PUBLIC_API_BASE_URL in your app .env:");
  console.log(`  EXPO_PUBLIC_API_BASE_URL=http://${localIP}:${PORT}`);
  console.log("");
  console.log("  Press Ctrl+C to stop.");
  console.log("─────────────────────────────────────────────────────");
});
