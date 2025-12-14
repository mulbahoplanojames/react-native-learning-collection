/**
 * Safe Area Wrapper Component
 * Consistent safe area handling across screens
 */

import { ReactNode } from "react";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";
import { ViewStyle } from "react-native";

interface SafeAreaWrapperProps extends SafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function SafeAreaWrapper({
  children,
  style,
  ...props
}: SafeAreaWrapperProps) {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} {...props}>
      {children}
    </SafeAreaView>
  );
}
