/**
 * Simple Chart Component
 * Basic bar chart for health metrics visualization
 */

import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../../design-system";

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
  title?: string;
  maxValue?: number;
  height?: number;
}

export function SimpleChart({
  data,
  title,
  maxValue,
  height = 200,
}: SimpleChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.chartContainer, { height }]}>
        {data.map((point, index) => {
          const percentage = (point.value / max) * 100;
          const barColor = point.color || colors.primary[500];

          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${percentage}%`,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.label}>{point.label}</Text>
              <Text style={styles.value}>{point.value}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingVertical: spacing.sm,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: spacing.xs,
  },
  barWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: "80%",
    minHeight: 4,
    borderRadius: 4,
  },
  label: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  value: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
});

