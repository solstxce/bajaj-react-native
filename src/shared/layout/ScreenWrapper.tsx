import React, { ReactNode, useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
      <LinearGradient
        colors={["#E6F3FF", "#F4F8FC", "#EEF2F7"]}
        locations={[0, 0.4, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#EEF2F7",
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
});
