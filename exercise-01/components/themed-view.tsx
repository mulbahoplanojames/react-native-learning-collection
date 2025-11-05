import React from "react";
import { View, ViewProps } from "react-native";

type ThemeViewProps = ViewProps & {
  className?: string;
  children: React.ReactNode;
};

export function ThemedView({
  className,
  style,
  children,
  ...rest
}: ThemeViewProps) {
  //   const colorScheme = useColorScheme();

  return (
    <View className={className} style={style} {...rest}>
      {children}
    </View>
  );
}
