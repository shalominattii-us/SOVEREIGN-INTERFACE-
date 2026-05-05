/**
 * Mock Data Service
 * Provides realistic mock data for all dashboard features
 */

export interface Cluster {
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

export interface MetaverseService {
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

export interface Alert {
  id: string;
  level: "critical" | "warning" | "info";
  message: string;
  timestamp: Date;
  source: string;
}

export interface Metric {
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

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: "error" | "warn" | "info" | "debug";
  service: string;
  message: string;
}

export interface Trace {
  id: string;
  service: string;
  duration: number;
  status: "success" | "error";
  timestamp: Date;
}

export interface FailoverEvent {
  id: string;
  fromCluster: string;
  toCluster: string;
  status: "completed" | "in-progress" | "failed";
  timestamp: Date;
  duration: number;
}

export interface DeploymentPhase {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  startTime?: Date;
  endTime?: Date;
}

export interface DeploymentEvent {
  id: string;
  phases: DeploymentPhase[];
  status: "pending" | "in-progress" | "completed" | "failed";
  timestamp: Date;
  duration?: number;
}

// Mock Clusters
export const mockClusters: Cluster[] = [
  {
    id: "cluster-1",
    name: "Primary AWS US-East",
    region: "us-east-1",
    type: "primary",
    status: "active",
    nodeCount: 10,
    healthyNodes: 10,
    cpuUsage: 62,
    memoryUsage: 58,
    lastHealthCheck: new Date(Date.now() - 30000),
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
    cpuUsage: 55,
    memoryUsage: 52,
    lastHealthCheck: new Date(Date.now() - 25000),
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
    cpuUsage: 15,
    memoryUsage: 18,
    lastHealthCheck: new Date(Date.now() - 40000),
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
    cpuUsage: 12,
    memoryUsage: 16,
    lastHealthCheck: new Date(Date.now() - 35000),
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
    cpuUsage: 38,
    memoryUsage: 42,
    lastHealthCheck: new Date(Date.now() - 20000),
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
    cpuUsage: 8,
    memoryUsage: 12,
    lastHealthCheck: new Date(Date.now() - 45000),
    podCount: 0,
    restartCount: 0,
    networkIO: { in: 20, out: 15 },
  },
];

// Mock Services
export const mockServices: MetaverseService[] = [
  {
    id: "service-1",
    name: "WebXR Gateway",
    status: "running",
    replicas: 5,
    desiredReplicas: 5,
    latencyP50: 45,
    latencyP95: 120,
    latencyP99: 280,
    errorRate: 0.02,
    lastDeployment: new Date(Date.now() - 3600000),
  },
  {
    id: "service-2",
    name: "Spatial Sync",
    status: "running",
    replicas: 3,
    desiredReplicas: 3,
    latencyP50: 16,
    latencyP95: 32,
    latencyP99: 64,
    errorRate: 0.01,
    lastDeployment: new Date(Date.now() - 7200000),
  },
  {
    id: "service-3",
    name: "Avatar Service",
    status: "running",
    replicas: 3,
    desiredReplicas: 3,
    latencyP50: 85,
    latencyP95: 210,
    latencyP99: 450,
    errorRate: 0.03,
    lastDeployment: new Date(Date.now() - 5400000),
  },
  {
    id: "service-4",
    name: "World State DB",
    status: "running",
    replicas: 2,
    desiredReplicas: 2,
    latencyP50: 120,
    latencyP95: 280,
    latencyP99: 520,
    errorRate: 0.01,
    lastDeployment: new Date(Date.now() - 10800000),
  },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    level: "warning",
    message: "High CPU usage on Secondary GCP cluster (78%)",
    timestamp: new Date(Date.now() - 300000),
    source: "cluster-4",
  },
  {
    id: "alert-2",
    level: "info",
    message: "Avatar Service deployed successfully",
    timestamp: new Date(Date.now() - 600000),
    source: "service-3",
  },
  {
    id: "alert-3",
    level: "warning",
    message: "WebXR Gateway error rate elevated (2.1%)",
    timestamp: new Date(Date.now() - 900000),
    source: "service-1",
  },
  {
    id: "alert-4",
    level: "info",
    message: "Cluster health check passed",
    timestamp: new Date(Date.now() - 1200000),
    source: "cluster-1",
  },
  {
    id: "alert-5",
    level: "warning",
    message: "Memory usage trending upward on Primary Azure",
    timestamp: new Date(Date.now() - 1500000),
    source: "cluster-2",
  },
];

// Mock Metrics
export const generateMockMetrics = (): Metric[] => {
  const metrics: Metric[] = [];
  const now = Date.now();
  for (let i = 60; i >= 0; i--) {
    metrics.push({
      timestamp: new Date(now - i * 60000),
      cpu: 50 + Math.random() * 30 - 10,
      memory: 55 + Math.random() * 25 - 10,
      disk: 35 + Math.random() * 15,
      networkIn: 1000 + Math.random() * 400 - 200,
      networkOut: 800 + Math.random() * 300 - 150,
      requestLatency: 80 + Math.random() * 100 - 30,
      errorRate: 0.01 + Math.random() * 0.03,
      throughput: 5000 + Math.random() * 2000 - 1000,
      spatialSyncLatency: 16 + Math.random() * 20 - 5,
      entityCount: 8500 + Math.random() * 1500 - 750,
    });
  }
  return metrics;
};

// Mock Logs
export const generateMockLogs = (): LogEntry[] => {
  const services = ["WebXR Gateway", "Spatial Sync", "Avatar Service", "World State DB"];
  const messages = [
    "Request processed successfully",
    "Cache hit for entity",
    "Database connection established",
    "Sync update sent to clients",
    "Avatar customization saved",
    "Connection timeout detected",
    "Retry attempt 1 of 3",
    "Service health check passed",
  ];
  const logs: LogEntry[] = [];
  const now = Date.now();

  for (let i = 0; i < 50; i++) {
    const level = Math.random() > 0.9 ? "error" : Math.random() > 0.7 ? "warn" : "info";
    logs.push({
      id: `log-${i}`,
      timestamp: new Date(now - i * 12000),
      level: level as "error" | "warn" | "info" | "debug",
      service: services[Math.floor(Math.random() * services.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
    });
  }
  return logs;
};

// Mock Traces
export const generateMockTraces = (): Trace[] => {
  const services = ["WebXR Gateway", "Spatial Sync", "Avatar Service"];
  const traces: Trace[] = [];
  const now = Date.now();

  for (let i = 0; i < 20; i++) {
    traces.push({
      id: `trace-${i}`,
      service: services[Math.floor(Math.random() * services.length)],
      duration: 50 + Math.random() * 200,
      status: Math.random() > 0.95 ? "error" : "success",
      timestamp: new Date(now - i * 30000),
    });
  }
  return traces;
};

// Mock Failover Events
export const mockFailoverEvents: FailoverEvent[] = [
  {
    id: "failover-1",
    fromCluster: "Primary AWS US-East",
    toCluster: "Secondary AWS US-West",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 7),
    duration: 240,
  },
  {
    id: "failover-2",
    fromCluster: "Primary Azure EU-West",
    toCluster: "Secondary GCP Asia Southeast",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 30),
    duration: 180,
  },
];

// Mock Deployment Events
export const generateMockDeploymentEvents = (): DeploymentEvent[] => {
  const phases: DeploymentPhase[] = [
    {
      id: "phase-1",
      name: "Infrastructure Provisioning",
      status: "completed",
      startTime: new Date(Date.now() - 86400000 * 5),
      endTime: new Date(Date.now() - 86400000 * 5 + 3600000),
    },
    {
      id: "phase-2",
      name: "Cluster Federation",
      status: "completed",
      startTime: new Date(Date.now() - 86400000 * 5 + 3600000),
      endTime: new Date(Date.now() - 86400000 * 5 + 7200000),
    },
    {
      id: "phase-3",
      name: "Service Mesh Installation",
      status: "completed",
      startTime: new Date(Date.now() - 86400000 * 5 + 7200000),
      endTime: new Date(Date.now() - 86400000 * 5 + 10800000),
    },
    {
      id: "phase-4",
      name: "Metaverse Services Deployment",
      status: "completed",
      startTime: new Date(Date.now() - 86400000 * 5 + 10800000),
      endTime: new Date(Date.now() - 86400000 * 5 + 14400000),
    },
    {
      id: "phase-5",
      name: "Observability Stack",
      status: "completed",
      startTime: new Date(Date.now() - 86400000 * 5 + 14400000),
      endTime: new Date(Date.now() - 86400000 * 5 + 18000000),
    },
  ];

  return [
    {
      id: "deployment-1",
      phases,
      status: "completed",
      timestamp: new Date(Date.now() - 86400000 * 5),
      duration: 18000,
    },
  ];
};

// Dashboard Summary
export interface DashboardSummary {
  overallHealth: "healthy" | "warning" | "critical";
  activeClusters: number;
  totalNodes: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
  runningServices: number;
  totalServices: number;
  recentAlerts: Alert[];
}

export const generateDashboardSummary = (): DashboardSummary => {
  const activeClusters = mockClusters.filter((c) => c.status === "active").length;
  const totalNodes = mockClusters.reduce((sum, c) => sum + c.nodeCount, 0);
  const avgCpuUsage = Math.round(
    mockClusters.reduce((sum, c) => sum + c.cpuUsage, 0) / mockClusters.length
  );
  const avgMemoryUsage = Math.round(
    mockClusters.reduce((sum, c) => sum + c.memoryUsage, 0) / mockClusters.length
  );
  const runningServices = mockServices.filter((s) => s.status === "running").length;
  const totalServices = mockServices.length;

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
    recentAlerts: mockAlerts.slice(0, 5),
  };
};
