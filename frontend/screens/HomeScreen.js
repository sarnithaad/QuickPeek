import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Title, Button, Text, useTheme } from 'react-native-paper';

export default function HomeScreen({ navigation, setToken }) {
  const theme = useTheme();

  const handleLogout = () => {
    setToken(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Welcome to QuickPeek</Title>
      <Text style={styles.subtitle}>
        Upload your videos and manage your content easily.
      </Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Upload')}
        style={styles.button}
        contentStyle={{ paddingVertical: 8 }}
      >
        Upload Video
      </Button>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={{ paddingVertical: 8 }}
      >
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e88e5',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 36,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    borderRadius: 8,
  },
  logoutButton: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 8,
  },
});

