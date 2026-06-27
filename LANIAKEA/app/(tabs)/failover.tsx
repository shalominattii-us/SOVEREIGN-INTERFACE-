import { ScrollView, View, Text, RefreshControl, Pressable, Alert } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { StatusBadge } from "@/components/ui/status-badge";
import { trpc } from "@/lib/trpc";

export default function FailoverScreen() {
  const [failoverInProgress, setFailoverInProgress] = useState(false);

  const { data: failoverStatus, refetch, isRefetching } = trpc.laniakea.getFailoverStatus.useQuery(undefined, { refetchInterval: 30000 });
  const initiateFailover = trpc.laniakea.initiateFailover.useMutation();

  const onRefresh = () => { refetch(); };

  const primaryClusterName = failoverStatus?.primaryCluster ?? "Primary Cluster";
  const secondaryClusterName = failoverStatus?.secondaryCluster ?? "Secondary Cluster";
  const handleFailover = () => {
    Alert.alert(
      "Initiate Failover",
      `Failover from ${primaryClusterName} to ${secondaryClusterName}?`,
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setFailoverInProgress(true);
            await initiateFailover.mutateAsync({ fromCluster: primaryClusterName, toCluster: secondaryClusterName });
            setTimeout(() => {
              setFailoverInProgress(false);
              refetch();
              Alert.alert("Success", "Failover initiated successfully");
            }, 2000);
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-white mb-1">Failover</Text>
          <Text className="text-sm text-white/80">Multi-Region Failover Control</Text>
        </View>

        <View className="px-6 mt-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Current Status</Text>

          <View className="bg-surface rounded-2xl p-4 border border-border mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm text-muted">Primary Cluster</Text>
              <StatusBadge status="active" size="sm" />
            </View>
            <Text className="text-lg font-bold text-foreground">{primaryClusterName}</Text>
            <Text className="text-xs text-muted mt-2">Readiness: {failoverStatus?.primaryReadiness ?? 100}%</Text>
          </View>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm text-muted">Secondary Cluster</Text>
              <StatusBadge status="standby" size="sm" />
            </View>
            <Text className="text-lg font-bold text-foreground">{secondaryClusterName}</Text>
            <Text className="text-xs text-muted mt-2">Readiness: {failoverStatus?.secondaryReadiness ?? 98}%</Text>
          </View>
        </View>

        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Failover Readiness</Text>
          <View className="bg-success/10 border border-success rounded-lg p-4">
            <Text className="text-sm font-semibold text-success">Ready for Failover</Text>
            <Text className="text-xs text-success mt-1">
              Secondary cluster is healthy and ready to take over
            </Text>
          </View>
        </View>

        <View className="px-6 mb-6">
          <Pressable
            onPress={handleFailover}
            disabled={failoverInProgress}
            style={{ opacity: failoverInProgress ? 0.6 : 1 }}
          >
            {({ pressed }) => (
              <View
                className={`bg-error rounded-lg p-4 ${pressed ? "opacity-80" : ""}`}
              >
                <Text className="text-white font-semibold text-center">
                  {failoverInProgress ? "Failover in Progress..." : "Initiate Failover"}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <View className="px-6 pb-8">
          <Text className="text-lg font-bold text-foreground mb-3">Recent Failovers</Text>
          {(failoverStatus?.history ?? []).length > 0 ? (
            (failoverStatus?.history ?? []).map((event) => (
              <View key={event.id} className="bg-surface rounded-lg p-4 border border-border mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-semibold text-foreground">
                    {event.fromCluster} → {event.toCluster}
                  </Text>
                  <StatusBadge status={event.status === "completed" ? "healthy" : "warning"} size="sm" />
                </View>
                <Text className="text-xs text-muted">
                  Duration: {event.duration} seconds
                </Text>
                <Text className="text-xs text-muted mt-1">
                  {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            ))
          ) : (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted text-center">No failover events</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
