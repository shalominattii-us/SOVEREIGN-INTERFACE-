import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { StatusBadge } from "./status-badge";
import type { Cluster } from "@/lib/mock-data";

export interface ClusterDetailsModalProps {
  cluster: Cluster | null;
  visible: boolean;
  onClose: () => void;
}

export function ClusterDetailsModal({ cluster, visible, onClose }: ClusterDetailsModalProps) {
  if (!cluster) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">{cluster.name}</Text>
            <Text className="text-sm text-white/80 mt-1">{cluster.region}</Text>
          </View>
          <Pressable onPress={onClose}>
            {({ pressed }) => (
              <Text className={`text-white text-xl font-bold ${pressed ? "opacity-70" : ""}`}>
                ✕
              </Text>
            )}
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Status Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Status</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm text-muted">Cluster Status</Text>
                <StatusBadge status={cluster.status} size="sm" />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Type</Text>
                <Text className="text-sm font-semibold text-foreground capitalize">
                  {cluster.type}
                </Text>
              </View>
            </View>
          </View>

          {/* Node Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Nodes</Text>
            <View className="space-y-2">
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm text-muted mb-1">Total Nodes</Text>
                <Text className="text-2xl font-bold text-foreground">{cluster.nodeCount}</Text>
              </View>
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm text-muted mb-1">Healthy Nodes</Text>
                <Text className="text-2xl font-bold text-success">{cluster.healthyNodes}</Text>
              </View>
              {cluster.healthyNodes < cluster.nodeCount && (
                <View className="bg-error/10 rounded-lg p-4 border border-error">
                  <Text className="text-sm font-semibold text-error">
                    {cluster.nodeCount - cluster.healthyNodes} unhealthy node
                    {cluster.nodeCount - cluster.healthyNodes !== 1 ? "s" : ""}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Resource Utilization */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Resource Utilization</Text>
            <View className="space-y-2">
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm text-muted mb-2">CPU Usage</Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 bg-border rounded-full h-2 mr-3">
                    <View
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${cluster.cpuUsage}%` }}
                    />
                  </View>
                  <Text className="text-sm font-bold text-foreground">{cluster.cpuUsage}%</Text>
                </View>
              </View>
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm text-muted mb-2">Memory Usage</Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 bg-border rounded-full h-2 mr-3">
                    <View
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${cluster.memoryUsage}%` }}
                    />
                  </View>
                  <Text className="text-sm font-bold text-foreground">{cluster.memoryUsage}%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Pod Information */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Pods</Text>
            <View className="space-y-2">
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm text-muted mb-1">Total Pods</Text>
                <Text className="text-2xl font-bold text-foreground">{cluster.podCount}</Text>
              </View>
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm text-muted mb-1">Restarts</Text>
                <Text className="text-2xl font-bold text-foreground">{cluster.restartCount}</Text>
              </View>
            </View>
          </View>

          {/* Network I/O */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Network I/O</Text>
            <View className="space-y-2">
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm text-muted mb-1">Inbound</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {cluster.networkIO.in} Mbps
                </Text>
              </View>
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-sm text-muted mb-1">Outbound</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {cluster.networkIO.out} Mbps
                </Text>
              </View>
            </View>
          </View>

          {/* Last Health Check */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-foreground mb-3">Health Check</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Last Check</Text>
              <Text className="text-sm font-semibold text-foreground">
                {cluster.lastHealthCheck.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
