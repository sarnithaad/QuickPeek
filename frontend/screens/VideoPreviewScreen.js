import React from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { Video } from 'expo-av';
const API_BASE = 'https://quickpeek.onrender.com';
export default function VideoPreviewScreen({ route }) {
  const theme = useTheme();
  const { video } = route.params;
  if (!video) {
    return (
      <View style={styles.center}>
        <Text>No video data provided.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Card style={styles.card} elevation={4}>
        <Card.Title title={video.title} />
        <Card.Content>
          <Video
            source={{ uri: `${API_BASE}${video.url}` }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            onError={(e) => {
              console.log('Video playback error:', e);
              Alert.alert('Playback Error', 'This video cannot be played.');
            }}
            shouldPlay={false}
          />
          <View style={styles.infoRow}>
            <IconButton
              icon="heart"
              color={theme.colors.primary}
              size={24}
              disabled
              accessibilityLabel="Likes"
            />
            <Text style={styles.likeText}>
              {video.likes} {video.likes === 1 ? 'Like' : 'Likes'}
            </Text>
          </View>
          <Text style={styles.uploader}>
            Uploaded By: {video.uploadedBy || 'Unknown'}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    paddingVertical: 8,
  },
  video: {
    width: width - 64,
    height: 220,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#000',
    alignSelf: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likeText: {
    fontSize: 16,
    marginLeft: 4,
  },
  uploader: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
