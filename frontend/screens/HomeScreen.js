import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Alert, Animated, Dimensions, Image } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, ActivityIndicator, IconButton } from 'react-native-paper';
import axios from 'axios';
import { Video } from 'expo-av';

const API_URL = 'https://quickpeek.onrender.com/api/videos';
const SCREEN_WIDTH = Dimensions.get('window').width;
const DEFAULT_THUMB = 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png'; // fallback thumbnail

export default function HomeScreen({ navigation, token, setToken }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const likeAnims = useRef({}).current;

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

  // Initialize animation values for each video
  useEffect(() => {
    videos.forEach(video => {
      if (!likeAnims[video._id]) {
        likeAnims[video._id] = new Animated.Value(1);
      }
    });
  }, [videos]);

  const animateLike = (id) => {
    Animated.sequence([
      Animated.timing(likeAnims[id], { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.timing(likeAnims[id], { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const likeVideo = async (id, idx) => {
    try {
      await axios.post(`${API_URL}/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = [...videos];
      updated[idx].likes += 1;
      setVideos(updated);
      animateLike(id);
    } catch (e) {
      Alert.alert('Error', 'Failed to like video');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <View style={styles.headerRow}>
        <Button
          mode="contained"
          icon="upload"
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Upload')}
        >
          Upload Video
        </Button>
        <Button
          mode="outlined"
          icon="logout"
          style={styles.headerBtn}
          onPress={() => setToken(null)}
          textColor="#e53935"
        >
          Logout
        </Button>
      </View>
      <FlatList
        data={videos}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item, index }) => (
          <Card style={styles.card} elevation={4}>
            <Video
              source={{ uri: `https://quickpeek.onrender.com${item.url}` }}
              style={styles.video}
              useNativeControls
              resizeMode="cover"
              isLooping
              onError={() => Alert.alert('Error', 'Failed to load video')}
            />
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              {item.thumbnail ? (
                <Avatar.Image
                  source={{ uri: `https://quickpeek.onrender.com${item.thumbnail}` }}
                  size={48}
                  style={{ marginRight: 12 }}
                />
              ) : (
                <Avatar.Image
                  source={{ uri: DEFAULT_THUMB }}
                  size={48}
                  style={{ marginRight: 12 }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Title style={styles.title}>{item.title}</Title>
                <Paragraph style={styles.subtitle}>
                  {item.uploader ? `Uploaded by ${item.uploader}` : 'Uploaded by User'}
                </Paragraph>
              </View>
              <Animated.View style={{ transform: [{ scale: likeAnims[item._id] || 1 }] }}>
                <IconButton
                  icon="heart"
                  iconColor="#e53935"
                  size={28}
                  onPress={() => likeVideo(item._id, index)}
                />
                <Paragraph style={styles.likes}>{item.likes}</Paragraph>
              </Animated.View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerBtn: {
    marginHorizontal: 4,
    borderRadius: 8,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  video: {
    width: SCREEN_WIDTH - 32,
    height: 220,
    backgroundColor: '#000',
    alignSelf: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  likes: {
    textAlign: 'center',
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: -12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
});
