import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  color?: "primary" | "success" | "warning" | "error";
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendValue,
  color = "primary",
}: MetricCardProps) {
  const colorClasses = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      <Text className="text-sm text-muted font-medium mb-2">{title}</Text>
      <View className="flex-row items-baseline gap-1 mb-2">
        <Text className="text-2xl font-bold text-foreground">{value}</Text>
        {unit && <Text className="text-sm text-muted">{unit}</Text>}
      </View>
      {(subtitle || trend) && (
        <View className="flex-row items-center justify-between">
          {subtitle && <Text className="text-xs text-muted">{subtitle}</Text>}
          {trend && trendValue !== undefined && (
            <Text className={cn("text-xs font-semibold", colorClasses[color])}>
              {trendIcons[trend]} {trendValue}%
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
