import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: "active" | "standby" | "degraded" | "offline" | "running" | "stopped" | "healthy" | "warning" | "critical";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const statusColors = {
    active: "bg-success",
    standby: "bg-muted",
    degraded: "bg-warning",
    offline: "bg-error",
    running: "bg-success",
    stopped: "bg-error",
    healthy: "bg-success",
    warning: "bg-warning",
    critical: "bg-error",
  };

  const statusLabels = {
    active: "Active",
    standby: "Standby",
    degraded: "Degraded",
    offline: "Offline",
    running: "Running",
    stopped: "Stopped",
    healthy: "Healthy",
    warning: "Warning",
    critical: "Critical",
  };

  const sizeClasses = {
    sm: "px-2 py-1",
    md: "px-3 py-1.5",
    lg: "px-4 py-2",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <View className={cn("rounded-full", statusColors[status], sizeClasses[size])}>
      <Text className={cn("font-semibold text-white", textSizeClasses[size])}>
        {label || statusLabels[status]}
      </Text>
    </View>
  );
}
