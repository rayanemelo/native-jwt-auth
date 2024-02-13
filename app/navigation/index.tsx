import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import { useAuth } from "../context/AuthContext";
import Home from "../screens/Home";
import { Button } from "react-native";

const Stack = createNativeStackNavigator();

export function Navigation() {
  const { authState, onLogout} = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{
              headerRight: () => (
                <Button title="Logout" onPress={onLogout} />
              ),
            }}
          />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
