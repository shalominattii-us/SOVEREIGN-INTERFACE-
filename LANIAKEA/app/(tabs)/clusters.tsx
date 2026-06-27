import { ScrollView, View, Text, RefreshControl, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ClusterCard } from "@/components/ui/cluster-card";
import { trpc } from "@/lib/trpc";

export default function ClustersScreen() {
  const { data: clusters = [], isLoading, refetch, isRefetching } = trpc.laniakea.getClusters.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const activeClusters = clusters.filter((c) => c.status === "active");
  const standbyClusters = clusters.filter((c) => c.status === "standby");
  const degradedClusters = clusters.filter((c) => c.status === "degraded");

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-white mb-1">Clusters</Text>
          <Text className="text-sm text-white/80">Multi-Cloud Kubernetes Clusters</Text>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text className="text-muted mt-4">Loading clusters...</Text>
          </View>
        )}

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
        {!isLoading && clusters.length === 0 && (
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
