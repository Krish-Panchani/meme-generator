import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Camera, Upload, Link, Globe } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNetwork } from '@/contexts/NetworkContext';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

interface ImageSelectorProps {
  onImageSelect: (uri: string) => void;
}

export function ImageSelector({ onImageSelect }: ImageSelectorProps) {
  const { theme } = useTheme();
  const { isConnected } = useNetwork();
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const pickImageFromLibrary = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        onImageSelect(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from library');
    }
  };

  const takePhoto = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not supported', 'Camera is not available on web platform');
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        onImageSelect(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const loadImageFromUrl = async () => {
    if (!urlInput.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    if (!isConnected) {
      Alert.alert('No internet', 'Internet connection is required to load images from URLs');
      return;
    }

    setIsLoadingUrl(true);
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Simple URL validation
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
      if (!urlPattern.test(urlInput.trim())) {
        Alert.alert('Invalid URL', 'Please enter a valid image URL (jpg, jpeg, png, gif, webp)');
        return;
      }

      onImageSelect(urlInput.trim());
      setUrlInput('');
    } catch (error) {
      Alert.alert('Error', 'Failed to load image from URL');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const popularImages = [
    'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  const styles = createStyles(theme);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Choose an Image</Text>
      <Text style={styles.subtitle}>Select from your device or use a URL</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
          <Upload size={24} color={theme.colors.primary} />
          <Text style={styles.buttonText}>From Library</Text>
        </TouchableOpacity>

        {Platform.OS !== 'web' && (
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Camera size={24} color={theme.colors.primary} />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.urlContainer}>
        <Text style={styles.sectionTitle}>Or enter image URL</Text>
        <View style={styles.urlInputContainer}>
          <TextInput
            style={styles.urlInput}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor={theme.colors.textSecondary}
            value={urlInput}
            onChangeText={setUrlInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.urlButton, (!urlInput.trim() || !isConnected) && styles.urlButtonDisabled]}
            onPress={loadImageFromUrl}
            disabled={!urlInput.trim() || !isConnected || isLoadingUrl}
          >
            <Link size={20} color={theme.colors.surface} />
          </TouchableOpacity>
        </View>
        {!isConnected && (
          <Text style={styles.offlineNote}>Internet connection required for URL images</Text>
        )}
      </View>

      {isConnected && (
        <View style={styles.popularContainer}>
          <Text style={styles.sectionTitle}>Popular Images</Text>
          <View style={styles.popularGrid}>
            {popularImages.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularItem}
                onPress={() => onImageSelect(imageUrl)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.popularImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    minWidth: 120,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.primary,
    marginTop: 8,
  },
  urlContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  urlInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  urlButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    marginLeft: 12,
  },
  urlButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
  offlineNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.error,
    marginTop: 8,
  },
  popularContainer: {
    flex: 1,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  popularImage: {
    width: '100%',
    height: '100%',
  },
});