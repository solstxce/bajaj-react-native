import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../theme/colors";

export function SearchBar() {
  const focusAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  const inputRef = useRef<TextInput>(null);
  const focused = useRef(false);

  useEffect(() => {
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(shineAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.5, duration: 1400, useNativeDriver: true }),
      ])
    );

    if (focused.current) {
      shineLoop.start();
      pulseLoop.start();
    }

    return () => {
      shineLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const handleFocus = () => {
    focused.current = true;
    Animated.timing(focusAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    focused.current = false;
    Animated.timing(focusAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.4)", "#2563EB"],
  });

  const glowOpacity = focusAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.15, 0.35],
  });

  const shineX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 400],
  });

  const pulseGlow = Animated.multiply(pulseAnim, glowOpacity);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.glowRing, { opacity: pulseGlow }]} />
      <Animated.View style={[styles.container, { borderColor }]}>
        <Animated.View
          style={[styles.shine, { opacity: focusAnim, transform: [{ translateX: shineX }] }]}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search tasks, alerts, branches..."
          placeholderTextColor="rgba(15,23,42,0.35)"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 8,
    position: "relative",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
  },
  glowRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#3B82F6",
    shadowColor: "#2563EB",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  shine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 999,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    width: "100%",
    paddingVertical: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
    outlineStyle: "none" as any,
  },
});
