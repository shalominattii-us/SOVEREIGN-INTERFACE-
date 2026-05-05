import { View, Text, Pressable } from "react-native";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/mock-data";

export interface AlertItemProps {
  alert: Alert;
  onPress?: () => void;
}

export function AlertItem({ alert, onPress }: AlertItemProps) {
  const levelColors = {
    critical: "bg-error/10 border-error",
    warning: "bg-warning/10 border-warning",
    info: "bg-primary/10 border-primary",
  };

  const levelTextColors = {
    critical: "text-error",
    warning: "text-warning",
    info: "text-primary",
  };

  const levelLabels = {
    critical: "Critical",
    warning: "Warning",
    info: "Info",
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          className={cn(
            "bg-surface rounded-lg p-3 border mb-2",
            levelColors[alert.level],
            pressed && "opacity-70"
          )}
        >
          <View className="flex-row items-start justify-between mb-1">
            <Text className={cn("text-xs font-bold", levelTextColors[alert.level])}>
              {levelLabels[alert.level]}
            </Text>
            <Text className="text-xs text-muted">{timeAgo(alert.timestamp)}</Text>
          </View>
          <Text className="text-sm text-foreground font-medium mb-1">{alert.message}</Text>
          <Text className="text-xs text-muted">{alert.source}</Text>
        </View>
      )}
    </Pressable>
  );
}
