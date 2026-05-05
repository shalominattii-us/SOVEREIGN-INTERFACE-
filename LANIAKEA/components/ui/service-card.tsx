import { View, Text, Pressable } from "react-native";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import type { MetaverseService } from "@/lib/mock-data";

export interface ServiceCardProps {
  service: MetaverseService;
  onPress?: () => void;
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          className={cn(
            "bg-surface rounded-2xl p-4 border border-border mb-3",
            pressed && "opacity-70"
          )}
        >
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground">{service.name}</Text>
              <Text className="text-xs text-muted mt-1">
                {service.replicas}/{service.desiredReplicas} replicas
              </Text>
            </View>
            <StatusBadge status={service.status} size="sm" />
          </View>

          <View className="flex-row justify-between mb-3 gap-2">
            <View className="flex-1">
              <Text className="text-xs text-muted mb-1">P50 Latency</Text>
              <Text className="text-lg font-bold text-foreground">{service.latencyP50}ms</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-muted mb-1">P95 Latency</Text>
              <Text className="text-lg font-bold text-foreground">{service.latencyP95}ms</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-muted mb-1">Error Rate</Text>
              <Text className="text-lg font-bold text-foreground">
                {(service.errorRate * 100).toFixed(2)}%
              </Text>
            </View>
          </View>

          <View className="pt-3 border-t border-border">
            <Text className="text-xs text-muted">
              P99: {service.latencyP99}ms • Deployed{" "}
              {Math.floor((Date.now() - service.lastDeployment.getTime()) / 3600000)}h ago
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
