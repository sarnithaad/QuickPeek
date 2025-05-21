import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { Title, Button, Text, IconButton, ActivityIndicator, useTheme, Card } from 'react-native-paper';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const API_BASE = 'https://quickpeek.onrender.com';
const VIDEOS_URL = `${API_BASE}/api/videos`;
const LIKE_URL = `${API_BASE}/api/videos/like`;
const PLACEHOLDER_THUMB = 'https://via.placeholder.com/400x200?text=No+Thumbnail';

export default function HomeScreen({ navigation, setToken, token, userId }) {
  const theme = useTheme();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState({});
  useFocusEffect(
    useCallback(() => {
    fetchVideos();
  }, [])
);
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(VIDEOS_URL);
      setVideos(res.data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load videos');
    }
    setLoading(false);
  };
  const handleLike = async (videoId, index) => {
    setLikeLoading(prev => ({ ...prev, [videoId]: true }));
    try {
      const res = await axios.post(`${LIKE_URL}/${videoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(prevVideos =>
        prevVideos.map(video =>
          (video.id || video._id) === videoId ? { ...video, likes: res.data.likes } : video
        )
      );
    } catch (e) {
      Alert.alert('Error', 'Could not like video');
    }
    setLikeLoading(prev => ({ ...prev, [videoId]: false }));
  };
  const handleLogout = () => {
    setToken(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  const goToUpload = () => {
    navigation.navigate('Upload');
  };
  const goToPreview = (video) => {
    navigation.navigate('VideoPreview', { video });
  };
  const renderItem = ({ item, index }) => (
    <Card style={styles.card} elevation={3}>
      <TouchableOpacity onPress={() => goToPreview(item)}>
                <Card.Cover
          source={{ uri: `${API_BASE}${item.thumbnail}` }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Card.Title title={item.title} />
      <Card.Content>
        <View style={styles.likeRow}>
          <IconButton
            icon="heart-outline"
            color={theme.colors.primary}
            size={26}
            onPress={() => handleLike(item.id || item._id, index)}
            disabled={likeLoading[item.id || item._id]}
            accessibilityLabel="Like"
          />
          <Text style={styles.likeText}>
            {item.likes} {item.likes === 1 ? 'Like' : 'Likes'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.topRow}>
        <Button
          mode="contained"
          icon="video"
          style={styles.topButton}
          onPress={goToUpload}
        >
          Upload Video
        </Button>
        <Button
          mode="outlined"
          icon="logout"
          style={styles.topButton}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>
      <Title style={styles.title}>Welcome to QuickPeek</Title>
      <Text style={styles.subtitle}>
        Browse and like videos uploaded by the community!
      </Text>
      {loading ? (
        <ActivityIndicator animating={true} style={{ marginTop: 40 }} />
      ) : videos.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 30, color: '#888' }}>
          No videos uploaded yet.
        </Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={item => item.id || item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  topButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 0,
    color: '#1e88e5',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  list: { padding: 16, paddingTop: 8 },
  card: { marginBottom: 18, borderRadius: 14 },
  thumbnail: {
    width: width - 64,
    height: 200,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#000',
    alignSelf: 'center',
  },
  likeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  likeText: { fontSize: 16, marginLeft: 4 },
});
