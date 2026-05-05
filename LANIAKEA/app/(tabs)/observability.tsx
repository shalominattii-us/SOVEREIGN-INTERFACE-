import { ScrollView, View, Text, RefreshControl, Pressable } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { generateMockMetrics, generateMockLogs, generateMockTraces } from "@/lib/mock-data";

export default function ObservabilityScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"metrics" | "logs" | "traces">("metrics");
  const [metrics] = useState(generateMockMetrics());
  const [logs] = useState(generateMockLogs());
  const [traces] = useState(generateMockTraces());

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const latestMetric = metrics[metrics.length - 1];
  const errorLogs = logs.filter((l) => l.level === "error");
  const successTraces = traces.filter((t) => t.status === "success");

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-white mb-1">Observability</Text>
          <Text className="text-sm text-white/80">Metrics, Logs & Traces</Text>
        </View>

        <View className="flex-row border-b border-border px-6 mt-6">
          {(["metrics", "logs", "traces"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 py-4 border-b-2"
              style={{
                borderBottomColor: activeTab === tab ? "#0a7ea4" : "transparent",
              }}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  activeTab === tab ? "text-primary" : "text-muted"
                }`}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "metrics" && (
          <View className="px-6 py-6">
            <Text className="text-lg font-bold text-foreground mb-4">Current Metrics</Text>
            {latestMetric && (
              <View className="space-y-3">
                <View className="bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-sm text-muted mb-1">CPU Usage</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    {latestMetric.cpu.toFixed(1)}%
                  </Text>
                </View>
                <View className="bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-sm text-muted mb-1">Memory Usage</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    {latestMetric.memory.toFixed(1)}%
                  </Text>
                </View>
                <View className="bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-sm text-muted mb-1">Request Latency</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    {latestMetric.requestLatency.toFixed(0)}ms
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === "logs" && (
          <View className="px-6 py-6">
            <Text className="text-lg font-bold text-foreground mb-4">Recent Logs</Text>
            <View className="space-y-2">
              {logs.slice(0, 10).map((log) => (
                <View key={log.id} className="bg-surface rounded-lg p-3 border border-border">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className={`text-xs font-bold ${
                        log.level === "error"
                          ? "text-error"
                          : log.level === "warn"
                            ? "text-warning"
                            : "text-success"
                      }`}
                    >
                      {log.level.toUpperCase()}
                    </Text>
                    <Text className="text-xs text-muted">{log.service}</Text>
                  </View>
                  <Text className="text-sm text-foreground">{log.message}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "traces" && (
          <View className="px-6 py-6 pb-8">
            <Text className="text-lg font-bold text-foreground mb-4">Recent Traces</Text>
            <View className="space-y-2">
              {traces.slice(0, 10).map((trace) => (
                <View key={trace.id} className="bg-surface rounded-lg p-3 border border-border">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm font-semibold text-foreground">{trace.service}</Text>
                    <Text
                      className={`text-xs font-bold ${
                        trace.status === "success" ? "text-success" : "text-error"
                      }`}
                    >
                      {trace.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">{trace.duration.toFixed(0)}ms</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
