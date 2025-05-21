import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3LightTheme as PaperTheme } from 'react-native-paper';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import VideoPreviewScreen from './screens/VideoPreviewScreen';
const Stack = createNativeStackNavigator();
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
  const [userId, setUserId] = useState(null);
  const [videos, setVideos] = useState([]);
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
              <Stack.Screen name="Register" options={{ title: "Register" }}>
                {props => <RegisterScreen {...props} setToken={setToken} setUserId={setUserId} />}
              </Stack.Screen>
              <Stack.Screen name="Login" options={{ title: "Login" }}>
                {props => <LoginScreen {...props} setToken={setToken} setUserId={setUserId} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name="Home" options={{ title: "Home" }}>
                {props => (
                  <HomeScreen
                    {...props}
                    token={token}
                    userId={userId}
                    setToken={setToken}
                    videos={videos}
                    setVideos={setVideos}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Upload" options={{ title: "Upload Video" }}>
                {props => (
                  <UploadScreen
                    {...props}
                    token={token}
                    userId={userId}
                    onUploadSuccess={(newVideo) => {
                      setVideos(prev => [newVideo, ...prev]);
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="VideoPreview"
                component={VideoPreviewScreen}
                options={{ title: "Preview Video" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
