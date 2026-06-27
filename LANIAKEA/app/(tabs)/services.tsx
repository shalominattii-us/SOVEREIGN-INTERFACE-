import { ScrollView, View, Text, RefreshControl, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ServiceCard } from "@/components/ui/service-card";
import { trpc } from "@/lib/trpc";

export default function ServicesScreen() {
  const { data: services = [], isLoading, refetch, isRefetching } = trpc.laniakea.getServices.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const runningServices = services.filter((s) => s.status === "running");
  const degradedServices = services.filter((s) => s.status === "degraded");
  const stoppedServices = services.filter((s) => s.status === "stopped");

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-white mb-1">Services</Text>
          <Text className="text-sm text-white/80">Metaverse Services Status</Text>
        </View>

        {/* Running Services */}
        {runningServices.length > 0 && (
          <View className="px-6 mt-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Running</Text>
            {runningServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        )}

        {/* Degraded Services */}
        {degradedServices.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Degraded</Text>
            {degradedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        )}

        {/* Stopped Services */}
        {stoppedServices.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Stopped</Text>
            {stoppedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        )}

        {/* Loading State */}
        {isLoading && (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text className="text-muted mt-4">Loading services...</Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && services.length === 0 && (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <Text className="text-lg font-semibold text-foreground mb-2">No Services</Text>
            <Text className="text-sm text-muted text-center">
              No services available. Check your connection and try again.
            </Text>
          </View>
        )}

        {/* Service Management Section */}
        <View className="px-6 pb-8 mt-6">
          <Text className="text-lg font-bold text-foreground mb-3">Service Management</Text>
          <Pressable>
            {({ pressed }) => (
              <View
                className={`bg-surface border border-border rounded-lg p-4 ${
                  pressed ? "opacity-70" : ""
                }`}
              >
                <Text className="text-foreground font-semibold">View Service Logs</Text>
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
