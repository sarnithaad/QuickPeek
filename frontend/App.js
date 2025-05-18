import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3LightTheme as PaperTheme } from 'react-native-paper';

import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';

const Stack = createNativeStackNavigator();

// Combine Paper and Navigation themes for consistency
const CombinedTheme = {
  ...DefaultTheme,
  ...PaperTheme,
  colors: {
    ...DefaultTheme.colors,
    ...PaperTheme.colors,
    primary: '#1e88e5',
    background: '#f5f6fa',
    card: '#fff',
    text: '#222',
  },
};

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <PaperProvider theme={CombinedTheme}>
      <NavigationContainer theme={CombinedTheme}>
        <Stack.Navigator
          initialRouteName={token == null ? "Register" : "Home"}
          screenOptions={{
            headerStyle: { backgroundColor: CombinedTheme.colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            animation: 'slide_from_right',
          }}
        >
          {token == null ? (
            <>
              <Stack.Screen
                name="Register"
                options={{ title: "Register" }}
              >
                {props => <RegisterScreen {...props} setToken={setToken} />}
              </Stack.Screen>
              <Stack.Screen
                name="Login"
                options={{ title: "Login" }}
              >
                {props => <LoginScreen {...props} setToken={setToken} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                options={{ title: "Home" }}
              >
                {props => <HomeScreen {...props} token={token} setToken={setToken} />}
              </Stack.Screen>
              <Stack.Screen
                name="Upload"
                options={{ title: "Upload Video" }}
              >
                {props => <UploadScreen {...props} token={token} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
