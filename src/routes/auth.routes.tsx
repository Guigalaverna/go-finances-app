import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignIn } from "../screens/SignIn";

const Stack = createStackNavigator();

export function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sign In" component={SignIn} />
    </Stack.Navigator>
  );
}
