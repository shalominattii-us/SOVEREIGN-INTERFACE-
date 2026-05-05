# Laniakea Metaverse Dashboard - Mobile App Design

## Overview

The Laniakea Metaverse Dashboard is a comprehensive mobile management interface for enterprise-scale metaverse infrastructure. It enables operators to monitor multi-cloud Kubernetes clusters, manage metaverse services, view observability metrics, and execute failover operations—all from a single, intuitive mobile interface optimized for one-handed usage.

---

## Screen List

1. **Dashboard (Home)** – Overview of all clusters, service health, and critical alerts
2. **Clusters** – Multi-cloud cluster status, node health, and resource utilization
3. **Services** – Metaverse services (WebXR Gateway, Spatial Sync, Avatar Service, World State DB)
4. **Observability** – Metrics, logs, and traces (Prometheus, ELK, Jaeger)
5. **Failover** – Manual failover controls and status
6. **Deployment** – Deployment workflow and history
7. **Settings** – App configuration, API endpoints, and preferences

---

## Primary Content and Functionality

### Screen 1: Dashboard (Home)

**Content:**
- **Status Summary Card** – Overall system health (Green/Yellow/Red)
- **Cluster Quick Stats** – Count of active clusters, total nodes, resource utilization (CPU, memory)
- **Service Health Grid** – 4 cards showing status of: WebXR Gateway, Spatial Sync, Avatar Service, World State DB
- **Recent Alerts** – Last 5 critical or warning alerts with timestamp
- **Quick Actions** – Buttons: "View Clusters", "Check Services", "Failover Status"

**Functionality:**
- Tap cluster card to navigate to Clusters screen
- Tap service card to navigate to Services screen
- Tap alert to view details
- Pull-to-refresh to update dashboard data

### Screen 2: Clusters

**Content:**
- **Cluster List** – Cards for each cluster (Primary AWS, Primary Azure, Secondary AWS, Secondary GCP, Edge K3s, DR)
  - Cluster name, region, status (Active/Standby/Degraded)
  - Node count, CPU/Memory utilization
  - Last health check timestamp
- **Cluster Details (Expandable)** – When tapped:
  - Node breakdown (healthy/unhealthy)
  - Pod count and restart count
  - Network I/O stats
  - Failover eligibility status

**Functionality:**
- Swipe to see cluster details
- Tap cluster to expand/collapse details
- Tap node to see node-level metrics
- Refresh individual cluster status

### Screen 3: Services

**Content:**
- **Service Cards** – One card per metaverse service:
  - Service name (WebXR Gateway, Spatial Sync, Avatar Service, World State DB)
  - Status (Running/Stopped/Degraded)
  - Replica count (current/desired)
  - Latency (p50, p95, p99)
  - Error rate
  - Last deployment timestamp
- **Service Details (Expandable)** – When tapped:
  - Pod logs (last 10 lines)
  - Resource limits and current usage
  - Configuration summary

**Functionality:**
- Tap service to expand/collapse details
- Tap "View Logs" to see recent pod logs
- Tap "Restart Service" to trigger restart (with confirmation)
- Pull-to-refresh to update service status

### Screen 4: Observability

**Content:**
- **Metrics Tab**
  - System metrics: CPU, Memory, Disk, Network I/O (line charts)
  - Application metrics: Request latency, error rate, throughput (line charts)
  - Spatial sync latency, entity count
- **Logs Tab**
  - Log stream (last 50 entries, filterable by level: Error/Warn/Info)
  - Search by keyword
  - Timestamp and service name
- **Traces Tab**
  - Recent traces (last 20)
  - Trace ID, service, duration, status
  - Tap to view trace details (span breakdown)

**Functionality:**
- Swipe between Metrics/Logs/Traces tabs
- Tap chart to see detailed metrics
- Filter logs by level or service
- Search logs by keyword
- Tap trace to see span waterfall

### Screen 5: Failover

**Content:**
- **Current Status Card**
  - Primary cluster (with status)
  - Secondary cluster (with status)
  - Last failover timestamp
  - Failover readiness (Ready/Not Ready)
- **Failover Controls**
  - "Initiate Failover" button (disabled if not ready)
  - "Manual Override" toggle (for advanced users)
  - Failover history (last 5 events)
- **Failover History**
  - Timestamp, from cluster, to cluster, status, duration

**Functionality:**
- Tap "Initiate Failover" to show confirmation dialog
- Confirmation dialog shows: "Failover from [Primary] to [Secondary]?"
- On confirm, show progress indicator and status updates
- Tap history item to see failover details (logs, affected services)

### Screen 6: Deployment

**Content:**
- **Deployment Workflow Steps**
  - Phase 1: Infrastructure Provisioning (status)
  - Phase 2: Cluster Federation (status)
  - Phase 3: Service Mesh Installation (status)
  - Phase 4: Metaverse Services Deployment (status)
  - Phase 5: Observability Stack (status)
- **Deployment History**
  - Recent deployments (last 10)
  - Timestamp, phase, status, duration
- **Deployment Actions**
  - "Start New Deployment" button
  - "View Logs" button

**Functionality:**
- Tap phase to see detailed status and logs
- Tap "Start New Deployment" to show confirmation
- View deployment logs in real-time
- Tap history item to see full deployment details

### Screen 7: Settings

**Content:**
- **API Configuration**
  - API Endpoint URL (text input)
  - API Key (masked input)
  - Test Connection button
- **Preferences**
  - Auto-refresh interval (dropdown: 5s, 10s, 30s, 1m)
  - Alert threshold (dropdown: Critical, Warning, Info)
  - Dark mode toggle
- **About**
  - App version
  - Laniakea framework version
  - License

**Functionality:**
- Update API endpoint and key
- Test connection to backend
- Save preferences to AsyncStorage
- Toggle dark mode

---

## Key User Flows

### Flow 1: Monitor Cluster Health
1. User opens app → Dashboard screen
2. User sees cluster status summary
3. User taps "View Clusters" → Clusters screen
4. User taps cluster card to expand details
5. User sees node breakdown and resource utilization
6. User pulls to refresh → updated data

### Flow 2: Check Service Status
1. User is on Dashboard
2. User taps service card → Services screen
3. User sees all metaverse services with status
4. User taps service to expand details
5. User taps "View Logs" → sees recent pod logs
6. User taps "Restart Service" → confirmation dialog → service restarts

### Flow 3: View Observability Metrics
1. User is on Dashboard
2. User taps "Check Metrics" → Observability screen
3. User swipes to Metrics tab → sees system and application metrics
4. User taps chart to see detailed view
5. User swipes to Logs tab → filters logs by level
6. User swipes to Traces tab → sees recent traces and can drill down

### Flow 4: Execute Failover
1. User is on Dashboard
2. User taps "Failover Status" → Failover screen
3. User sees current primary and secondary clusters
4. User taps "Initiate Failover" → confirmation dialog
5. User confirms → failover starts
6. User sees progress indicator and real-time status updates
7. Failover completes → history updated

### Flow 5: Deploy Infrastructure
1. User is on Dashboard
2. User navigates to Deployment screen
3. User sees deployment workflow phases
4. User taps "Start New Deployment" → confirmation dialog
5. User confirms → deployment starts
6. User sees real-time progress for each phase
7. Deployment completes → history updated

---

## Color Choices

| Element | Light Mode | Dark Mode | Purpose |
|---------|-----------|-----------|---------|
| **Primary** | `#0a7ea4` (Teal) | `#0a7ea4` (Teal) | Accent, buttons, highlights |
| **Background** | `#ffffff` (White) | `#151718` (Very Dark Gray) | Screen background |
| **Surface** | `#f5f5f5` (Light Gray) | `#1e2022` (Dark Gray) | Cards, elevated surfaces |
| **Foreground** | `#11181c` (Dark Gray) | `#ecedee` (Light Gray) | Primary text |
| **Muted** | `#687076` (Medium Gray) | `#9ba1a6` (Light Gray) | Secondary text |
| **Border** | `#e5e7eb` (Light Border) | `#334155` (Dark Border) | Dividers, borders |
| **Success** | `#22c55e` (Green) | `#4ade80` (Light Green) | Healthy status, success |
| **Warning** | `#f59e0b` (Amber) | `#fbbf24` (Light Amber) | Warning alerts, degraded |
| **Error** | `#ef4444` (Red) | `#f87171` (Light Red) | Critical alerts, errors |

---

## Interaction Patterns

### Status Indicators
- **Green** – Service/cluster healthy, running normally
- **Yellow/Amber** – Degraded, warning, needs attention
- **Red** – Critical, failed, requires immediate action
- **Gray** – Offline, standby, not running

### Loading States
- Skeleton loaders for initial data load
- Spinner for refresh/update operations
- Progress bars for long-running operations (failover, deployment)

### Confirmation Dialogs
- Used for destructive actions (failover, restart, deployment)
- Shows action details and consequences
- Cancel/Confirm buttons

### Feedback
- Toast notifications for success/error messages
- Haptic feedback on button press (light impact)
- Pull-to-refresh visual feedback

---

## Navigation Structure

```
Root (Tab Navigator)
├── Dashboard (Home Tab)
│   └── Can navigate to Clusters, Services, Failover, Deployment
├── Clusters (Tab)
│   └── Cluster Details (Modal)
├── Services (Tab)
│   └── Service Details (Modal)
├── Observability (Tab)
│   └── Metrics / Logs / Traces (Swipe Tabs)
├── Failover (Tab)
│   └── Failover Confirmation (Modal)
├── Deployment (Tab)
│   └── Deployment Details (Modal)
└── Settings (Tab)
```

---

## Design System Notes

- **Typography**: Use system fonts (SF Pro Display on iOS, Roboto on Android)
- **Spacing**: 4px grid (4, 8, 12, 16, 20, 24, 32 px)
- **Border Radius**: 8px for cards, 12px for buttons, 16px for modals
- **Shadows**: Subtle elevation for cards (iOS-style)
- **Safe Area**: Always respect notch and home indicator
- **One-Handed Usage**: All interactive elements within thumb reach on 6.1" screen
