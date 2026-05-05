import { ScrollView, View, Text, TextInput, Pressable, Switch } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";

export default function SettingsScreen() {
  const [apiEndpoint, setApiEndpoint] = useState("https://api.laniakea.io");
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-primary px-6 pt-6 pb-8">
          <Text className="text-2xl font-bold text-white mb-1">Settings</Text>
          <Text className="text-sm text-white/80">App Configuration</Text>
        </View>

        <View className="px-6 mt-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-4">API Configuration</Text>
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">API Endpoint</Text>
            <TextInput
              value={apiEndpoint}
              onChangeText={setApiEndpoint}
              className="bg-surface border border-border rounded-lg p-3 text-foreground"
              placeholderTextColor="#687076"
              editable={true}
            />
          </View>
          <Pressable>
            {({ pressed }) => (
              <View
                className={`bg-primary rounded-lg p-3 ${pressed ? "opacity-80" : ""}`}
              >
                <Text className="text-white font-semibold text-center">Test Connection</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View className="px-6 mb-6 border-t border-border pt-6">
          <Text className="text-lg font-bold text-foreground mb-4">Preferences</Text>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-semibold text-foreground">Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#e5e7eb", true: "#0a7ea4" }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground">Auto-Refresh</Text>
            <Switch
              value={autoRefresh}
              onValueChange={setAutoRefresh}
              trackColor={{ false: "#e5e7eb", true: "#0a7ea4" }}
            />
          </View>
        </View>

        <View className="px-6 pb-8 border-t border-border pt-6">
          <Text className="text-lg font-bold text-foreground mb-4">About</Text>
          <View className="bg-surface rounded-lg p-4 border border-border">
            <View className="mb-3">
              <Text className="text-xs text-muted mb-1">App Version</Text>
              <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
            </View>
            <View className="mb-3">
              <Text className="text-xs text-muted mb-1">Laniakea Framework</Text>
              <Text className="text-sm font-semibold text-foreground">Enterprise Edition</Text>
            </View>
            <View>
              <Text className="text-xs text-muted mb-1">License</Text>
              <Text className="text-sm font-semibold text-foreground">Proprietary</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
