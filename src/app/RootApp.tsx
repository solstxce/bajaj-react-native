import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppProvider } from "../context/AppContext";
import { RootNavigator } from "../navigation/RootNavigator";

export function RootApp() {
  return (
    <AppProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
