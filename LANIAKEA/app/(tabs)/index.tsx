import { ScrollView, View, Text, Pressable, RefreshControl, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlertItem } from "@/components/ui/alert-item";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();

  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = trpc.laniakea.getDashboardSummary.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const { data: services } = trpc.laniakea.getServices.useQuery(undefined, {
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="text-muted mt-4">Loading Dashboard...</Text>
      </ScreenContainer>
    );
  }

  if (isError || !summary) {
    return (
      <ScreenContainer className="items-center justify-center px-6">
        <Text className="text-error text-xl font-bold mb-2">Error Loading Dashboard</Text>
        <Text className="text-muted text-center mb-6">
          {error?.message ?? "Network request failed"}
        </Text>
        <Pressable onPress={() => refetch()}>
          {({ pressed }) => (
            <View className={`bg-primary rounded-xl px-8 py-3 ${pressed ? "opacity-80" : ""}`}>
              <Text className="text-white font-semibold">Retry</Text>
            </View>
          )}
        </Pressable>
      </ScreenContainer>
    );
  }

  const healthColor =
    summary.overallHealth === "healthy"
      ? "bg-success"
      : summary.overallHealth === "warning"
        ? "bg-warning"
        : "bg-error";

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-3xl font-bold text-white mb-2">Laniakea Dashboard</Text>
          <Text className="text-sm text-white/80">Multi-Cloud Metaverse Infrastructure</Text>
        </View>

        {/* Overall Health Card */}
        <View className="px-6 -mt-4 mb-6">
          <View className={`${healthColor} rounded-2xl p-6 border border-border`}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-white">System Health</Text>
              <StatusBadge status={summary.overallHealth} size="sm" />
            </View>
            <View className="flex-row justify-between gap-4">
              <View className="flex-1">
                <Text className="text-xs text-white/70 mb-1">Active Clusters</Text>
                <Text className="text-2xl font-bold text-white">{summary.activeClusters}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-white/70 mb-1">Total Nodes</Text>
                <Text className="text-2xl font-bold text-white">{summary.totalNodes}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-white/70 mb-1">Services</Text>
                <Text className="text-2xl font-bold text-white">
                  {summary.runningServices}/{summary.totalServices}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Metrics Section */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Resource Utilization</Text>
          <View className="gap-3">
            <MetricCard
              title="Average CPU Usage"
              value={summary.avgCpuUsage}
              unit="%"
              trend={summary.avgCpuUsage > 70 ? "up" : "stable"}
              trendValue={summary.avgCpuUsage > 70 ? 5 : 2}
              color={summary.avgCpuUsage > 70 ? "warning" : "success"}
            />
            <MetricCard
              title="Average Memory Usage"
              value={summary.avgMemoryUsage}
              unit="%"
              trend={summary.avgMemoryUsage > 70 ? "up" : "stable"}
              trendValue={summary.avgMemoryUsage > 70 ? 3 : 1}
              color={summary.avgMemoryUsage > 70 ? "warning" : "success"}
            />
          </View>
        </View>

        {/* Service Health Grid */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Metaverse Services</Text>
          <View className="flex-row flex-wrap gap-3">
            {(services ?? []).map((service) => (
              <Pressable
                key={service.id}
                onPress={() => router.push("/services")}
                className="flex-1 min-w-[45%]"
              >
                {({ pressed }) => (
                  <View
                    className={`bg-surface rounded-xl p-3 border border-border ${
                      pressed ? "opacity-70" : ""
                    }`}
                  >
                    <Text className="text-sm font-semibold text-foreground mb-2 truncate">
                      {service.name}
                    </Text>
                    <StatusBadge status={service.status} size="sm" />
                    <Text className="text-xs text-muted mt-2">
                      {service.replicas} replicas
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Alerts */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-foreground">Recent Alerts</Text>
            <Pressable>
              {({ pressed }) => (
                <Text className={`text-sm font-semibold text-primary ${pressed ? "opacity-70" : ""}`}>
                  View All
                </Text>
              )}
            </Pressable>
          </View>
          {summary.recentAlerts.length > 0 ? (
            summary.recentAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))
          ) : (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted text-center">No recent alerts</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-6 pb-8">
          <Text className="text-lg font-bold text-foreground mb-3">Quick Actions</Text>
          <View className="gap-2">
            <Pressable onPress={() => router.push("/clusters")}>
              {({ pressed }) => (
                <View
                  className={`bg-primary rounded-lg p-4 ${pressed ? "opacity-80" : ""}`}
                >
                  <Text className="text-white font-semibold">View Clusters</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/(tabs)/failover")}>
              {({ pressed }) => (
                <View
                  className={`bg-surface border border-border rounded-lg p-4 ${
                    pressed ? "opacity-70" : ""
                  }`}
                >
                  <Text className="text-foreground font-semibold">Failover Status</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/(tabs)/observability")}>
              {({ pressed }) => (
                <View
                  className={`bg-surface border border-border rounded-lg p-4 ${
                    pressed ? "opacity-70" : ""
                  }`}
                >
                  <Text className="text-foreground font-semibold">View Metrics</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
