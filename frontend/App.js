import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={token == null ? "Register" : "Home"}>
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
  );
}
