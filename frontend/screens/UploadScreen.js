import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Card, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Video } from 'expo-video';

const API_BASE = 'https://quickpeek.onrender.com';
const API_URL = `${API_BASE}/api/videos/upload`;

export default function UploadScreen({ navigation, token }) {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [thumb, setThumb] = useState(null);
  const [errorMsg, setErrorMsgimport React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Card, useTheme, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import axios from 'axios';

const API_BASE = 'https://quickpeek.onrender.com';
const API_URL = `${API_BASE}/api/videos/upload`;
const LIKE_URL = `${API_BASE}/api/videos/like`;

export default function UploadScreen({ navigation, token }) {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [thumb, setThumb] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState(null); // Stores the uploaded video object
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work!');
      }
    })();
  }, []);

  const pickVideo = async () => {
    setThumb(null);
    setUploadStatus('');
    setErrorMsg('');
    setUploadedVideo(null);
    setLikeCount(0);
    setLiked(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.5,
      });

      if (!result.canceled) {
        setVideo(result.assets[0]);
      } else {
        setErrorMsg('No video selected');
      }
    } catch (e) {
      setErrorMsg('Could not pick video: ' + e.message);
      Alert.alert('Error', 'Could not pick video: ' + e.message);
    }
  };

  const handleUpload = async () => {
    if (!video || !title.trim()) {
      setErrorMsg('Select a video and enter a title');
      setUploadStatus('error');
      return;
    }

    if (!token) {
      Alert.alert('Authentication Error', 'User is not authenticated.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setUploadStatus('uploading');
    setThumb(null);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('video', {
      uri: video.uri,
      name: 'video.mp4',
      type: 'video/mp4'
    });

    try {
      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setThumb(`${API_BASE}${res.data.video.thumbnail}`);
      setTitle('');
      setVideo(null);
      setErrorMsg('');
      setUploadStatus('success');
      setUploadedVideo(res.data.video); // Save the uploaded video object
      setLikeCount(res.data.video.likes || 0);
      setLiked(false);
      Alert.alert('Success', 'Video uploaded successfully!');
    } catch (e) {
      setErrorMsg(e.response?.data?.msg || 'Upload failed');
      setUploadStatus('error');
    }

    setUploading(false);
  };

  // Like button handler
  const handleLike = async () => {
    if (!uploadedVideo || !uploadedVideo._id) return;

    // Optimistic UI update
    setLiked(true);
    setLikeCount((prev) => prev + 1);

    try {
      await axios.post(`${LIKE_URL}/${uploadedVideo._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally, update likeCount from response if backend returns it
      // setLikeCount(response.data.likes);
    } catch (e) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
      Alert.alert('Error', 'Could not like video');
    }
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
                <Text style={styles.selectedText}>
                  Selected: {video?.uri?.split('/').pop() ?? 'Unknown'}
                </Text>
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
              disabled={uploading || !video || !title.trim()}
              style={styles.button}
              contentStyle={{ paddingVertical: 6 }}
            >
              Upload
            </Button>

            {uploading && <ActivityIndicator animating={true} style={{ marginTop: 10 }} />}

            {/* Show uploaded thumbnail and Like button after success */}
            {uploadStatus === 'success' && thumb && (
              <View style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ marginBottom: 6 }}>Uploaded Thumbnail:</Text>
                <Card.Cover source={{ uri: thumb }} style={styles.thumb} />
                {/* Like Button */}
                {uploadedVideo && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <IconButton
                      icon={liked ? 'heart' : 'heart-outline'}
                      color={liked ? 'red' : theme.colors.primary}
                      size={28}
                      onPress={handleLike}
                      disabled={liked}
                    />
                    <Text style={{ fontSize: 16 }}>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</Text>
                  </View>
                )}
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
] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const theme = useTheme();

  // Request media library permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work!');
      }
    })();
  }, []);

  const pickVideo = async () => {
    setThumb(null);
    setUploadStatus('');
    setErrorMsg('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Correct for your version
        allowsEditing: false,
        quality: 0.5,
      });
      // Uncomment for debugging:
      // Alert.alert('Picker Result', JSON.stringify(result, null, 2));

      if (!result.canceled) {
        setVideo(result.assets[0]);
      } else {
        setErrorMsg('No video selected');
      }
    } catch (e) {
      setErrorMsg('Could not pick video: ' + e.message);
      Alert.alert('Error', 'Could not pick video: ' + e.message);
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
    setThumb(null);

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
