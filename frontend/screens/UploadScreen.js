import React, { useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Card, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Video } from 'expo-av';

const API_BASE = 'https://quickpeek.onrender.com';
const API_URL = `${API_BASE}/api/videos/upload`;

export default function UploadScreen({ navigation, token }) {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [thumb, setThumb] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'uploading', 'success', 'error'
  const theme = useTheme();

  const pickVideo = async () => {
    // Clear previous thumbnail and status when picking a new video
    setThumb(null);
    setUploadStatus('');
    setErrorMsg('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.5,
      });
      if (!result.canceled) setVideo(result.assets[0]);
    } catch (e) {
      setErrorMsg('Could not pick video');
    }
  };

  const handleUpload = async () => {
    if (!video || !title) {
      setErrorMsg('Select video and enter title');
      setUploadStatus('error');
      return;
    }
    setUploading(true);
    setErrorMsg('');
    setUploadStatus('uploading');
    setThumb(null); // Hide thumbnail until upload is done

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', {
      uri: video.uri,
      name: 'video.mp4',
      type: 'video/mp4'
    });
    try {
      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let axios set Content-Type automatically
        }
      });
      setThumb(`${API_BASE}${res.data.video.thumbnail}`);
      setTitle('');
      setVideo(null);
      setErrorMsg('');
      setUploadStatus('success');
    } catch (e) {
      setErrorMsg(e.response?.data?.msg || 'Upload failed');
      setUploadStatus('error');
    }
    setUploading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Card style={styles.card} elevation={4}>
          <Card.Title title="Upload Video" titleStyle={styles.title} />
          <Card.Content>
            <Button
              mode="outlined"
              icon="video"
              onPress={pickVideo}
              style={styles.button}
            >
              Pick Video
            </Button>
            {video && (
              <View style={{ alignItems: 'center', marginVertical: 12 }}>
                <Text style={styles.selectedText}>Selected: {video.uri.split('/').pop()}</Text>
                <Video
                  source={{ uri: video.uri }}
                  style={{ width: 220, height: 180, borderRadius: 12, marginVertical: 10 }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                />
              </View>
            )}
            <TextInput
              label="Video Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="format-title" />}
            />

            {/* Upload status and error messages */}
            {uploadStatus === 'uploading' && (
              <Text style={{ color: theme.colors.primary, marginTop: 10 }}>Uploading...</Text>
            )}
            {uploadStatus === 'success' && (
              <Text style={{ color: 'green', marginTop: 10 }}>Upload successful!</Text>
            )}
            {uploadStatus === 'error' && errorMsg && (
              <Text style={styles.error}>{errorMsg}</Text>
            )}

            <Button
              mode="contained"
              icon="cloud-upload"
              onPress={handleUpload}
              loading={uploading}
              disabled={uploading}
              style={styles.button}
              contentStyle={{ paddingVertical: 6 }}
            >
              Upload
            </Button>
            {uploading && <ActivityIndicator animating={true} style={{ marginTop: 10 }} />}

            {/* Show thumbnail ONLY if upload was successful */}
            {uploadStatus === 'success' && thumb && (
              <View style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ marginBottom: 6 }}>Uploaded Thumbnail:</Text>
                <Card.Cover source={{ uri: thumb }} style={styles.thumb} />
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, paddingVertical: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e88e5' },
  input: { marginVertical: 10 },
  button: { marginVertical: 8, borderRadius: 8 },
  selectedText: { fontSize: 14, color: '#444', marginBottom: 4 },
  thumb: { width: 140, height: 100, borderRadius: 12, marginTop: 6 },
  error: { color: '#e53935', marginBottom: 8, marginTop: 2, fontSize: 14, textAlign: 'center' },
});
