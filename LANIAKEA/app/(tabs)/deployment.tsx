import { ScrollView, View, Text, RefreshControl, Pressable } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { StatusBadge } from "@/components/ui/status-badge";
import { generateMockDeploymentEvents } from "@/lib/mock-data";

export default function DeploymentScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [deployments] = useState(generateMockDeploymentEvents());

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const currentDeployment = deployments[0];

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-white mb-1">Deployment</Text>
          <Text className="text-sm text-white/80">Infrastructure Deployment Workflow</Text>
        </View>

        {currentDeployment && (
          <View className="px-6 mt-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-4">Deployment Phases</Text>
            {currentDeployment.phases.map((phase, index) => (
              <View key={phase.id} className="mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      Phase {index + 1}: {phase.name}
                    </Text>
                  </View>
                  <StatusBadge
                    status={
                      phase.status === "completed"
                        ? "healthy"
                        : phase.status === "in-progress"
                          ? "warning"
                          : "critical"
                    }
                    size="sm"
                  />
                </View>
                <View className="bg-surface rounded-lg p-3 border border-border">
                  <View className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <View
                      className="bg-primary h-full"
                      style={{
                        width: phase.status === "completed" ? "100%" : "50%",
                      }}
                    />
                  </View>
                  {phase.startTime && phase.endTime && (
                    <Text className="text-xs text-muted mt-2">
                      Duration:{" "}
                      {Math.round(
                        (phase.endTime.getTime() - phase.startTime.getTime()) / 1000 / 60
                      )}{" "}
                      minutes
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="px-6 mb-6">
          <Pressable>
            {({ pressed }) => (
              <View
                className={`bg-primary rounded-lg p-4 ${pressed ? "opacity-80" : ""}`}
              >
                <Text className="text-white font-semibold text-center">Start New Deployment</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View className="px-6 pb-8">
          <Text className="text-lg font-bold text-foreground mb-3">Deployment History</Text>
          {deployments.map((deployment) => (
            <View key={deployment.id} className="bg-surface rounded-lg p-4 border border-border mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-foreground">
                  {deployment.timestamp.toLocaleDateString()}
                </Text>
                <StatusBadge
                  status={deployment.status === "completed" ? "healthy" : "warning"}
                  size="sm"
                />
              </View>
              <Text className="text-xs text-muted">
                {deployment.phases.length} phases • {deployment.duration ? `${Math.round(deployment.duration / 60)} min` : "In progress"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
