import { View, Text, Pressable } from "react-native";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import type { Cluster } from "@/lib/mock-data";

export interface ClusterCardProps {
  cluster: Cluster;
  onPress?: () => void;
}

export function ClusterCard({ cluster, onPress }: ClusterCardProps) {
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
              <Text className="text-base font-bold text-foreground">{cluster.name}</Text>
              <Text className="text-xs text-muted mt-1">{cluster.region}</Text>
            </View>
            <StatusBadge status={cluster.status} size="sm" />
          </View>

          <View className="flex-row justify-between mb-3 gap-2">
            <View className="flex-1">
              <Text className="text-xs text-muted mb-1">Nodes</Text>
              <Text className="text-lg font-bold text-foreground">
                {cluster.healthyNodes}/{cluster.nodeCount}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-muted mb-1">CPU</Text>
              <Text className="text-lg font-bold text-foreground">{cluster.cpuUsage}%</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-muted mb-1">Memory</Text>
              <Text className="text-lg font-bold text-foreground">{cluster.memoryUsage}%</Text>
            </View>
          </View>

          <View className="pt-3 border-t border-border">
            <Text className="text-xs text-muted">
              {cluster.podCount} pods • {cluster.restartCount} restarts
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
