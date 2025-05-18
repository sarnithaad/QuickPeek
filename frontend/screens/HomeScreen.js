import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { Video } from 'expo-av';

const API_URL = 'https://quickpeek.onrender.com/api/videos';

export default function HomeScreen({ navigation, token, setToken }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setVideos(res.data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load videos');
    }
    setLoading(false);
  };

  useEffect(() => { fetchVideos(); }, []);

  const likeVideo = async (id, idx) => {
    try {
      await axios.post(`${API_URL}/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = [...videos];
      updated[idx].likes += 1;
      setVideos(updated);
    } catch (e) {
      Alert.alert('Error', 'Failed to like video');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex:1 }} size="large" />;

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <Button title="Upload Video" onPress={() => navigation.navigate('Upload')} />
      <Button title="Logout" onPress={() => setToken(null)} color="red" />
      <FlatList
        data={videos}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Video
              source={{ uri: `https://quickpeek.onrender.com${item.url}` }}
              style={styles.video}
              useNativeControls
              resizeMode="cover"
              isLooping
            />
            <View style={styles.info}>
              <Image source={{ uri: `https://quickpeek.onrender.com${item.thumbnail}` }} style={styles.thumb} />
              <View style={{ flex:1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity style={styles.likeBtn} onPress={() => likeVideo(item.id, index)}>
                  <Text>❤️ {item.likes}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { margin:10, backgroundColor:'#fff', borderRadius:10, overflow:'hidden', elevation:2 },
  video: { width:'100%', height:250, backgroundColor:'#000' },
  info: { flexDirection:'row', alignItems:'center', padding:10 },
  thumb: { width:60, height:45, borderRadius:5, marginRight:10 },
  title: { fontSize:16, fontWeight:'bold' },
  likeBtn: { marginTop:5 }
});
