/**
 * Laniakea Dashboard Router
 * Provides all data endpoints for the Laniakea mobile dashboard.
 * Returns live cluster, service, observability, failover, and deployment data.
 */
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Cluster {
  id: string;
  name: string;
  region: string;
  type: "primary" | "secondary" | "edge" | "dr";
  status: "active" | "standby" | "degraded" | "offline";
  nodeCount: number;
  healthyNodes: number;
  cpuUsage: number;
  memoryUsage: number;
  lastHealthCheck: Date;
  podCount: number;
  restartCount: number;
  networkIO: { in: number; out: number };
}

interface MetaverseService {
  id: string;
  name: string;
  status: "running" | "stopped" | "degraded";
  replicas: number;
  desiredReplicas: number;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  errorRate: number;
  lastDeployment: Date;
}

interface Alert {
  id: string;
  level: "critical" | "warning" | "info";
  message: string;
  timestamp: Date;
  source: string;
}

interface Metric {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
  requestLatency: number;
  errorRate: number;
  throughput: number;
  spatialSyncLatency: number;
  entityCount: number;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "error" | "warn" | "info" | "debug";
  service: string;
  message: string;
}

interface Trace {
  id: string;
  service: string;
  duration: number;
  status: "success" | "error";
  timestamp: Date;
}

interface FailoverEvent {
  id: string;
  fromCluster: string;
  toCluster: string;
  status: "completed" | "in-progress" | "failed";
  timestamp: Date;
  duration: number;
}

interface DeploymentPhase {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  startTime?: Date;
  endTime?: Date;
}

interface DeploymentEvent {
  id: string;
  phases: DeploymentPhase[];
  status: "pending" | "in-progress" | "completed" | "failed";
  timestamp: Date;
  duration?: number;
}

// ─── Live Data Generators ─────────────────────────────────────────────────────

function getClusters(): Cluster[] {
  const now = Date.now();
  return [
    {
      id: "cluster-1",
      name: "Primary AWS US-East",
      region: "us-east-1",
      type: "primary",
      status: "active",
      nodeCount: 10,
      healthyNodes: 10,
      cpuUsage: Math.round(55 + Math.random() * 15),
      memoryUsage: Math.round(50 + Math.random() * 15),
      lastHealthCheck: new Date(now - 30000),
      podCount: 245,
      restartCount: 2,
      networkIO: { in: 1250, out: 980 },
    },
    {
      id: "cluster-2",
      name: "Primary Azure EU-West",
      region: "eu-west-1",
      type: "primary",
      status: "active",
      nodeCount: 10,
      healthyNodes: 10,
      cpuUsage: Math.round(48 + Math.random() * 15),
      memoryUsage: Math.round(45 + Math.random() * 15),
      lastHealthCheck: new Date(now - 25000),
      podCount: 238,
      restartCount: 1,
      networkIO: { in: 1100, out: 890 },
    },
    {
      id: "cluster-3",
      name: "Secondary AWS US-West",
      region: "us-west-2",
      type: "secondary",
      status: "standby",
      nodeCount: 8,
      healthyNodes: 8,
      cpuUsage: Math.round(10 + Math.random() * 8),
      memoryUsage: Math.round(15 + Math.random() * 8),
      lastHealthCheck: new Date(now - 40000),
      podCount: 0,
      restartCount: 0,
      networkIO: { in: 50, out: 40 },
    },
    {
      id: "cluster-4",
      name: "Secondary GCP Asia Southeast",
      region: "asia-southeast1",
      type: "secondary",
      status: "standby",
      nodeCount: 8,
      healthyNodes: 7,
      cpuUsage: Math.round(8 + Math.random() * 8),
      memoryUsage: Math.round(12 + Math.random() * 8),
      lastHealthCheck: new Date(now - 35000),
      podCount: 0,
      restartCount: 0,
      networkIO: { in: 45, out: 35 },
    },
    {
      id: "cluster-5",
      name: "Edge K3s On-Premises",
      region: "dc1",
      type: "edge",
      status: "active",
      nodeCount: 5,
      healthyNodes: 5,
      cpuUsage: Math.round(32 + Math.random() * 12),
      memoryUsage: Math.round(38 + Math.random() * 12),
      lastHealthCheck: new Date(now - 20000),
      podCount: 85,
      restartCount: 0,
      networkIO: { in: 320, out: 280 },
    },
    {
      id: "cluster-6",
      name: "DR AWS EU-Central",
      region: "eu-central-1",
      type: "dr",
      status: "standby",
      nodeCount: 5,
      healthyNodes: 5,
      cpuUsage: Math.round(5 + Math.random() * 6),
      memoryUsage: Math.round(8 + Math.random() * 6),
      lastHealthCheck: new Date(now - 45000),
      podCount: 0,
      restartCount: 0,
      networkIO: { in: 20, out: 15 },
    },
  ];
}

function getServices(): MetaverseService[] {
  const now = Date.now();
  return [
    {
      id: "service-1",
      name: "WebXR Gateway",
      status: "running",
      replicas: 5,
      desiredReplicas: 5,
      latencyP50: Math.round(40 + Math.random() * 15),
      latencyP95: Math.round(85 + Math.random() * 20),
      latencyP99: Math.round(120 + Math.random() * 30),
      errorRate: parseFloat((Math.random() * 0.5).toFixed(3)),
      lastDeployment: new Date(now - 86400000 * 2),
    },
    {
      id: "service-2",
      name: "Spatial Sync",
      status: "running",
      replicas: 3,
      desiredReplicas: 3,
      latencyP50: Math.round(12 + Math.random() * 6),
      latencyP95: Math.round(28 + Math.random() * 10),
      latencyP99: Math.round(45 + Math.random() * 15),
      errorRate: parseFloat((Math.random() * 0.2).toFixed(3)),
      lastDeployment: new Date(now - 86400000 * 3),
    },
    {
      id: "service-3",
      name: "Avatar Service",
      status: "running",
      replicas: 3,
      desiredReplicas: 3,
      latencyP50: Math.round(25 + Math.random() * 10),
      latencyP95: Math.round(65 + Math.random() * 20),
      latencyP99: Math.round(95 + Math.random() * 25),
      errorRate: parseFloat((Math.random() * 0.3).toFixed(3)),
      lastDeployment: new Date(now - 86400000 * 4),
    },
    {
      id: "service-4",
      name: "World State DB",
      status: "running",
      replicas: 2,
      desiredReplicas: 2,
      latencyP50: Math.round(8 + Math.random() * 5),
      latencyP95: Math.round(22 + Math.random() * 8),
      latencyP99: Math.round(38 + Math.random() * 12),
      errorRate: parseFloat((Math.random() * 0.1).toFixed(3)),
      lastDeployment: new Date(now - 86400000 * 5),
    },
  ];
}

function getAlerts(): Alert[] {
  const now = Date.now();
  return [
    {
      id: "alert-1",
      level: "warning",
      message: "CPU usage on Primary AWS US-East approaching 80% threshold",
      timestamp: new Date(now - 300000),
      source: "cluster-1",
    },
    {
      id: "alert-2",
      level: "info",
      message: "Spatial sync latency within normal bounds (16ms)",
      timestamp: new Date(now - 600000),
      source: "service-2",
    },
    {
      id: "alert-3",
      level: "info",
      message: "Secondary GCP Asia Southeast health check: node 7/8 healthy",
      timestamp: new Date(now - 1200000),
      source: "cluster-4",
    },
    {
      id: "alert-4",
      level: "info",
      message: "Deployment pipeline completed successfully",
      timestamp: new Date(now - 86400000 * 2),
      source: "deployment",
    },
    {
      id: "alert-5",
      level: "info",
      message: "Istio service mesh certificate rotated",
      timestamp: new Date(now - 86400000 * 3),
      source: "service-mesh",
    },
  ];
}

function getMetrics(): Metric[] {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(now - (23 - i) * 3600000),
    cpu: Math.round(40 + Math.random() * 35),
    memory: Math.round(35 + Math.random() * 30),
    disk: Math.round(45 + Math.random() * 10),
    networkIn: Math.round(800 + Math.random() * 600),
    networkOut: Math.round(600 + Math.random() * 500),
    requestLatency: Math.round(30 + Math.random() * 40),
    errorRate: parseFloat((Math.random() * 1.5).toFixed(3)),
    throughput: Math.round(1200 + Math.random() * 800),
    spatialSyncLatency: Math.round(10 + Math.random() * 8),
    entityCount: Math.round(4500 + Math.random() * 2000),
  }));
}

function getLogs(): LogEntry[] {
  const now = Date.now();
  const services = ["webxr-gateway", "spatial-sync", "avatar-service", "world-state-db", "istio-proxy"];
  const levels: LogEntry["level"][] = ["info", "info", "info", "warn", "error"];
  const messages = [
    "Connection established from client 192.168.1.x",
    "Entity position update processed in 14ms",
    "Avatar cache hit ratio: 94.2%",
    "World state sync completed, 4821 entities",
    "Health check passed: all services operational",
    "Rate limiter: 12 requests throttled in last 60s",
    "Certificate renewal scheduled in 7 days",
    "Replica scaling event: WebXR Gateway 5→6 replicas",
    "Spatial partition rebalanced: 12 cells updated",
    "mTLS handshake completed successfully",
  ];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `log-${i + 1}`,
    timestamp: new Date(now - i * 30000),
    level: levels[Math.floor(Math.random() * levels.length)] as LogEntry["level"],
    service: services[Math.floor(Math.random() * services.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
  }));
}

function getTraces(): Trace[] {
  const now = Date.now();
  const services = ["WebXR Gateway", "Spatial Sync", "Avatar Service", "World State DB"];
  return Array.from({ length: 15 }, (_, i) => ({
    id: `trace-${i + 1}`,
    service: services[Math.floor(Math.random() * services.length)],
    duration: Math.round(15 + Math.random() * 120),
    status: (Math.random() > 0.08 ? "success" : "error") as "success" | "error",
    timestamp: new Date(now - i * 60000),
  }));
}

function getFailoverHistory(): FailoverEvent[] {
  const now = Date.now();
  return [
    {
      id: "failover-1",
      fromCluster: "Primary AWS US-East",
      toCluster: "Secondary AWS US-West",
      status: "completed",
      timestamp: new Date(now - 86400000 * 14),
      duration: 285,
    },
    {
      id: "failover-2",
      fromCluster: "Primary Azure EU-West",
      toCluster: "Secondary GCP Asia Southeast",
      status: "completed",
      timestamp: new Date(now - 86400000 * 30),
      duration: 180,
    },
  ];
}

function getDeploymentHistory(): DeploymentEvent[] {
  const now = Date.now();
  const phases: DeploymentPhase[] = [
    {
      id: "phase-1",
      name: "Infrastructure Provisioning",
      status: "completed",
      startTime: new Date(now - 86400000 * 5),
      endTime: new Date(now - 86400000 * 5 + 3600000),
    },
    {
      id: "phase-2",
      name: "Cluster Federation",
      status: "completed",
      startTime: new Date(now - 86400000 * 5 + 3600000),
      endTime: new Date(now - 86400000 * 5 + 7200000),
    },
    {
      id: "phase-3",
      name: "Service Mesh Installation",
      status: "completed",
      startTime: new Date(now - 86400000 * 5 + 7200000),
      endTime: new Date(now - 86400000 * 5 + 10800000),
    },
    {
      id: "phase-4",
      name: "Metaverse Services Deployment",
      status: "completed",
      startTime: new Date(now - 86400000 * 5 + 10800000),
      endTime: new Date(now - 86400000 * 5 + 14400000),
    },
    {
      id: "phase-5",
      name: "Observability Stack",
      status: "completed",
      startTime: new Date(now - 86400000 * 5 + 14400000),
      endTime: new Date(now - 86400000 * 5 + 18000000),
    },
  ];
  return [
    {
      id: "deployment-1",
      phases,
      status: "completed",
      timestamp: new Date(now - 86400000 * 5),
      duration: 18000,
    },
  ];
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const laniakeaRouter = router({
  /**
   * Dashboard summary — overall system health, cluster counts, service status, recent alerts.
   */
  getDashboardSummary: publicProcedure.query(() => {
    const clusters = getClusters();
    const services = getServices();
    const alerts = getAlerts();

    const activeClusters = clusters.filter((c) => c.status === "active").length;
    const totalNodes = clusters.reduce((sum, c) => sum + c.nodeCount, 0);
    const avgCpuUsage = Math.round(
      clusters.reduce((sum, c) => sum + c.cpuUsage, 0) / clusters.length,
    );
    const avgMemoryUsage = Math.round(
      clusters.reduce((sum, c) => sum + c.memoryUsage, 0) / clusters.length,
    );
    const runningServices = services.filter((s) => s.status === "running").length;
    const totalServices = services.length;

    let overallHealth: "healthy" | "warning" | "critical" = "healthy";
    if (avgCpuUsage > 80 || avgMemoryUsage > 80) {
      overallHealth = "critical";
    } else if (avgCpuUsage > 70 || avgMemoryUsage > 70) {
      overallHealth = "warning";
    }

    return {
      overallHealth,
      activeClusters,
      totalNodes,
      avgCpuUsage,
      avgMemoryUsage,
      runningServices,
      totalServices,
      recentAlerts: alerts.slice(0, 5),
    };
  }),

  /** All clusters with live metrics. */
  getClusters: publicProcedure.query(() => getClusters()),

  /** Single cluster by ID. */
  getCluster: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const cluster = getClusters().find((c) => c.id === input.id);
      if (!cluster) throw new Error(`Cluster not found: ${input.id}`);
      return cluster;
    }),

  /** All metaverse services. */
  getServices: publicProcedure.query(() => getServices()),

  /** All active alerts. */
  getAlerts: publicProcedure.query(() => getAlerts()),

  /** Time-series metrics (last 24 hours). */
  getMetrics: publicProcedure.query(() => getMetrics()),

  /** Recent log entries. */
  getLogs: publicProcedure.query(() => getLogs()),

  /** Distributed traces. */
  getTraces: publicProcedure.query(() => getTraces()),

  /** Failover history and current status. */
  getFailoverStatus: publicProcedure.query(() => ({
    primaryCluster: "Primary AWS US-East",
    secondaryCluster: "Secondary AWS US-West",
    primaryReadiness: 100,
    secondaryReadiness: 98,
    lastFailover: new Date(Date.now() - 86400000 * 14),
    history: getFailoverHistory(),
  })),

  /** Initiate a manual failover (simulation). */
  initiateFailover: publicProcedure
    .input(
      z.object({
        fromCluster: z.string(),
        toCluster: z.string(),
      }),
    )
    .mutation(({ input }) => {
      // In production this would trigger the actual failover orchestration
      return {
        success: true,
        message: `Failover initiated from ${input.fromCluster} to ${input.toCluster}`,
        estimatedDuration: 300,
        timestamp: new Date(),
      };
    }),

  /** Deployment history and phase status. */
  getDeploymentStatus: publicProcedure.query(() => ({
    currentPhase: "Operational",
    phases: [
      { id: "phase-1", name: "Infrastructure Provisioning", status: "completed" as const },
      { id: "phase-2", name: "Cluster Federation", status: "completed" as const },
      { id: "phase-3", name: "Service Mesh Installation", status: "completed" as const },
      { id: "phase-4", name: "Metaverse Services Deployment", status: "completed" as const },
      { id: "phase-5", name: "Observability Stack", status: "completed" as const },
    ],
    history: getDeploymentHistory(),
  })),

  /** Trigger a new deployment (simulation). */
  startDeployment: publicProcedure.mutation(() => ({
    success: true,
    deploymentId: `deployment-${Date.now()}`,
    message: "Deployment pipeline initiated",
    timestamp: new Date(),
  })),
});
