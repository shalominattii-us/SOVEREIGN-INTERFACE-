import { ScrollView, View, Text, RefreshControl, Pressable, Alert } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockClusters, mockFailoverEvents } from "@/lib/mock-data";

export default function FailoverScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [failoverInProgress, setFailoverInProgress] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const primaryCluster = mockClusters.find((c) => c.type === "primary" && c.status === "active");
  const secondaryCluster = mockClusters.find((c) => c.type === "secondary");

  const handleFailover = () => {
    Alert.alert(
      "Initiate Failover",
      `Failover from ${primaryCluster?.name} to ${secondaryCluster?.name}?`,
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setFailoverInProgress(true);
            setTimeout(() => {
              setFailoverInProgress(false);
              Alert.alert("Success", "Failover completed successfully");
            }, 2000);
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-white mb-1">Failover</Text>
          <Text className="text-sm text-white/80">Multi-Region Failover Control</Text>
        </View>

        <View className="px-6 mt-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Current Status</Text>

          {primaryCluster && (
            <View className="bg-surface rounded-2xl p-4 border border-border mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm text-muted">Primary Cluster</Text>
                <StatusBadge status={primaryCluster.status} size="sm" />
              </View>
              <Text className="text-lg font-bold text-foreground">{primaryCluster.name}</Text>
              <Text className="text-xs text-muted mt-2">{primaryCluster.region}</Text>
            </View>
          )}

          {secondaryCluster && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm text-muted">Secondary Cluster</Text>
                <StatusBadge status={secondaryCluster.status} size="sm" />
              </View>
              <Text className="text-lg font-bold text-foreground">{secondaryCluster.name}</Text>
              <Text className="text-xs text-muted mt-2">{secondaryCluster.region}</Text>
            </View>
          )}
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
          {mockFailoverEvents.length > 0 ? (
            mockFailoverEvents.map((event) => (
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
