import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Share, Alert } from 'react-native';
import { Image } from 'expo-image';
import { X, Share2, Heart, Download } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useMeme } from '@/contexts/MemeContext';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface MemeModalProps {
  meme: any;
  visible: boolean;
  onClose: () => void;
}

export function MemeModal({ meme, visible, onClose }: MemeModalProps) {
  const { theme } = useTheme();
  const { toggleFavorite } = useMeme();

  const handleToggleFavorite = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await toggleFavorite(meme.id);
  };

  const handleShare = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(meme.memeUri);
      } else {
        Alert.alert('Share not available', 'Sharing is not available on this platform');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share meme');
    }
  };

  const handleDownload = async () => {
    if (Platform.OS === 'web') return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll access is required to save images');
        return;
      }

      await MediaLibrary.saveToLibraryAsync(meme.memeUri);
      Alert.alert('Success', 'Meme saved to camera roll!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save to camera roll');
    }
  };

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Meme Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: meme.memeUri }}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
          />

          <View style={styles.info}>
            <Text style={styles.text}>Top: {meme.topText || 'No top text'}</Text>
            <Text style={styles.text}>Bottom: {meme.bottomText || 'No bottom text'}</Text>
            <Text style={styles.date}>
              Created: {new Date(meme.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleToggleFavorite}>
              <Heart
                size={24}
                color={meme.isFavorite ? theme.colors.error : theme.colors.textSecondary}
                fill={meme.isFavorite ? theme.colors.error : 'none'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {Platform.OS !== 'web' && (
              <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
                <Download size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    maxWidth: 400,
    width: '100%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 20,
  },
  info: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.text,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    padding: 12,
  },
});