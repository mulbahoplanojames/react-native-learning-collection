import React from "react";
import { Text, TextProps } from "react-native";

export type ThemeTextProps = TextProps & {
  className?: string;
  children: React.ReactNode;
};

export function ThemedText({
  className,
  style,
  children,
  ...rest
}: ThemeTextProps) {
  //   const colorScheme = useColorScheme() ?? "light";
  //   const theme = Colors[colorScheme];

  return (
    <Text className={className} style={style} {...rest}>
      {children}
    </Text>
  );
}
