import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token == null ? (
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} setToken={setToken} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {props => <HomeScreen {...props} token={token} setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="Upload">
              {props => <UploadScreen {...props} token={token} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
