import { ScrollView, View, Text, RefreshControl } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ClusterCard } from "@/components/ui/cluster-card";
import { mockClusters } from "@/lib/mock-data";

export default function ClustersScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const activeClusters = mockClusters.filter((c) => c.status === "active");
  const standbyClusters = mockClusters.filter((c) => c.status === "standby");
  const degradedClusters = mockClusters.filter((c) => c.status === "degraded");

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-white mb-1">Clusters</Text>
          <Text className="text-sm text-white/80">Multi-Cloud Kubernetes Clusters</Text>
        </View>

        {/* Active Clusters */}
        {activeClusters.length > 0 && (
          <View className="px-6 mt-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Active</Text>
            {activeClusters.map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
          </View>
        )}

        {/* Standby Clusters */}
        {standbyClusters.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Standby</Text>
            {standbyClusters.map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
          </View>
        )}

        {/* Degraded Clusters */}
        {degradedClusters.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Degraded</Text>
            {degradedClusters.map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {mockClusters.length === 0 && (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <Text className="text-lg font-semibold text-foreground mb-2">No Clusters</Text>
            <Text className="text-sm text-muted text-center">
              No clusters available. Check your connection and try again.
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
