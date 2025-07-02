import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { X, Save, Type } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface EditMemeModalProps {
  meme: any;
  visible: boolean;
  onClose: () => void;
  onSave: (updatedMeme: any) => Promise<void>;
}

export function EditMemeModal({ meme, visible, onClose, onSave }: EditMemeModalProps) {
  const { theme } = useTheme();
  const [topText, setTopText] = useState(meme.topText);
  const [bottomText, setBottomText] = useState(meme.bottomText);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const updatedMeme = {
        ...meme,
        topText: topText.trim(),
        bottomText: bottomText.trim(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(updatedMeme);
      Alert.alert('Success', 'Meme updated successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update meme');
    } finally {
      setIsSaving(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Meme</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.memePreview}>
            <Image
              source={{ uri: meme.memeUri }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            
            {topText && (
              <View style={styles.topTextContainer}>
                <Text style={styles.memeText}>
                  {topText.toUpperCase()}
                </Text>
              </View>
            )}
            
            {bottomText && (
              <View style={styles.bottomTextContainer}>
                <Text style={styles.memeText}>
                  {bottomText.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Type size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.textInput}
                placeholder="Top text"
                placeholderTextColor={theme.colors.textSecondary}
                value={topText}
                onChangeText={setTopText}
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Type size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.textInput}
                placeholder="Bottom text"
                placeholderTextColor={theme.colors.textSecondary}
                value={bottomText}
                onChangeText={setBottomText}
                maxLength={50}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, isSaving && styles.savingButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Save size={20} color={theme.colors.surface} />
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
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
  memePreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  topTextContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  memeText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 8,
  },
  inputs: {
    gap: 16,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.text,
    paddingVertical: 12,
    paddingLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  savingButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: theme.colors.text,
  },
  saveButtonText: {
    color: theme.colors.surface,
  },
});