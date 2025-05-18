import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Video } from 'expo-av';

const API_URL = 'https://quickpeek.onrender.com/api/videos/upload';

export default function UploadScreen({ navigation, token }) {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [thumb, setThumb] = useState(null);

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.5,
      });
      if (!result.canceled) setVideo(result.assets[0]);
    } catch (e) {
      Alert.alert('Error', 'Could not pick video');
    }
  };

  const handleUpload = async () => {
    if (!video || !title) return Alert.alert('Error', 'Select video and enter title');
    setUploading(true);
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
          'Content-Type': 'multipart/form-data'
        }
      });
      setThumb(`https://quickpeek.onrender.com${res.data.video.thumbnail}`);
      Alert.alert('Success', 'Video uploaded');
      setTitle('');
      setVideo(null);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.msg || 'Upload failed');
    }
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Video</Text>
      <Button title="Pick Video" onPress={pickVideo} />
      {video && (
        <>
          <Text>Selected: {video.uri.split('/').pop()}</Text>
          <Video
            source={{ uri: video.uri }}
            style={{ width: 200, height: 200, marginVertical: 10 }}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        </>
      )}
      <TextInput style={styles.input} placeholder="Enter title" value={title} onChangeText={setTitle} />
      <Button title="Upload" onPress={handleUpload} disabled={uploading} />
      {uploading && <ActivityIndicator size="large" />}
      {thumb && (
        <View style={{ alignItems:'center', marginTop:10 }}>
          <Text>Uploaded Thumbnail:</Text>
          <Image source={{ uri: thumb }} style={styles.thumb} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginVertical:8 },
  thumb: { width:120, height:90, borderRadius:10, marginTop:10 }
});
