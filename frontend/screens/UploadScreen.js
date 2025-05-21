import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, TextInput, ActivityIndicator, Text } from 'react-native-paper';
import { Video } from 'expo-av';  // add this for video preview
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const UploadScreen = ({ token, userId, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      return Alert.alert("Permission required", "Please allow access to media library.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      if (!selected.uri.endsWith('.mp4')) {
        return Alert.alert('Invalid format', 'Only MP4 videos are allowed.');
      }
      setVideo(selected);
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) return Alert.alert("Validation", "Please enter a video title.");
    if (!video) return Alert.alert("Validation", "Please select a video to upload.");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', {
      uri: video.uri,
      name: video.uri.split('/').pop(),
      type: 'video/mp4',
    });

    try {
      setLoading(true);
      const res = await axios.post('https://quickpeek.onrender.com/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Video uploaded successfully!");
      setTitle('');
      setVideo(null);

      

      navigation.navigate('Home');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      Alert.alert("Upload failed", err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Video Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Button mode="outlined" onPress={pickVideo} style={styles.button}>
        {video ? 'Change Video' : 'Pick Video'}
      </Button>

      {/* Video Preview + filename */}
      {video && (
        <View style={styles.previewContainer}>
          <Video
            source={{ uri: video.uri }}
            style={styles.videoPreview}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          <Text style={styles.videoInfo}>Selected: {video.uri.split('/').pop()}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      ) : (
        <Button
          mode="contained"
          onPress={handleUpload}
          disabled={!video || !title.trim()}
          style={styles.button}
        >
          Upload
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 10,
  },
  loader: {
    marginTop: 20,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  videoPreview: {
    width: '100%',
    maxWidth: 400,
    height: 220,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  videoInfo: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#333',
  },
});

export default UploadScreen;
