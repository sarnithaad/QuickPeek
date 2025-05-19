import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme, Title } from 'react-native-paper';
import axios from 'axios';

const API_URL = 'https://quickpeek.onrender.com/api/auth';

export default function RegisterScreen({ navigation, setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleRegister = async () => {
    setErrorMsg('');

    // Basic validation
    if (!email.trim() || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(API_URL + '/register', {
        email: email.trim(),
        password
      });
      setToken(res.data.token);
    } catch (e) {
      setErrorMsg(e.response?.data?.msg || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Title style={styles.title}>Create Account</Title>
        <Text style={styles.subtitle}>Register for QuickPeek</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />
        <HelperText type="error" visible={!!errorMsg}>
          {errorMsg}
        </HelperText>
        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          Register
        </Button>
        <Text style={styles.toggle} onPress={() => navigation.navigate('Login')}>
          Already have an account? <Text style={{ color: theme.colors.primary }}>Login</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:24 },
  title: { fontSize:28, fontWeight:'bold', marginBottom:8, color: '#1e88e5' },
  subtitle: { fontSize:16, color:'#666', marginBottom:24 },
  input: { width:'100%', maxWidth:400, marginVertical:6 },
  button: { width:'100%', maxWidth:400, marginTop:16, borderRadius:8 },
  toggle: { marginTop:24, fontSize:15, color:'#444', textAlign:'center' }
});
