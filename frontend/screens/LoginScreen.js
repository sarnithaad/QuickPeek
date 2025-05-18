import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export default function LoginScreen({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const res = await axios.post(API_URL + endpoint, { email, password });
      setToken(res.data.token);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.msg || 'Auth failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>
      <TextInput style={styles.input} placeholder="Email" value={email}
        onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password}
        onChangeText={setPassword} secureTextEntry />
      <Button title={isRegister ? "Register" : "Login"} onPress={handleAuth} />
      <Text style={styles.toggle} onPress={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "No account? Register"}
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
