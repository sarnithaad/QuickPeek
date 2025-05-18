import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'https://quickpeek.onrender.com/api/auth';

export default function LoginScreen({ navigation, setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(API_URL + '/login', { email, password });
      setToken(res.data.token);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email}
        onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password}
        onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.toggle} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title: { fontSize:28, fontWeight:'bold', marginBottom:20 },
  input: { width:'100%', borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginVertical:8 },
  toggle: { color:'blue', marginTop:15 }
});
