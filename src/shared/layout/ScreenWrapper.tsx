import React, { ReactNode, useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";
import { colors, spacing } from "../../theme/theme";

interface Props {
  children: ReactNode;
  scroll?: boolean;
}

export function ScreenWrapper({ children, scroll = true }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const animatedStyle = { opacity, transform: [{ translateY }] };

  const content = scroll
    ? (
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </Animated.View>
    )
    : (
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <View style={styles.scrollContent}>
          {children}
        </View>
      </Animated.View>
    );

  return (
    <View style={styles.root}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
});
