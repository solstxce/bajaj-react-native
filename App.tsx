import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootApp } from "./src/app/RootApp";

export default function App() {
  return (
    <SafeAreaProvider>
      <RootApp />
    </SafeAreaProvider>
  );
}
