import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Type, Wand as Wand2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { captureRef } from 'react-native-view-shot';
import * as Haptics from 'expo-haptics';

interface MemeEditorProps {
  imageUri: string;
  topText: string;
  bottomText: string;
  onTopTextChange: (text: string) => void;
  onBottomTextChange: (text: string) => void;
  onMemeGenerated: (uri: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export function MemeEditor({
  imageUri,
  topText,
  bottomText,
  onTopTextChange,
  onBottomTextChange,
  onMemeGenerated,
  isGenerating,
  setIsGenerating,
}: MemeEditorProps) {
  const { theme } = useTheme();
  const memeRef = useRef<View>(null);
  const [fontFamily, setFontFamily] = useState('Inter-Bold');
  const [textColor, setTextColor] = useState('#FFFFFF');

  const generateMeme = async () => {
    if (!memeRef.current) return;

    setIsGenerating(true);
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const uri = await captureRef(memeRef.current, {
        format: 'png',
        quality: 0.9,
      });

      onMemeGenerated(uri);
    } catch (error) {
      console.error('Failed to generate meme:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.memeContainer} ref={memeRef}>
        <Image
          source={{ uri: imageUri }}
          style={styles.memeImage}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        
        {topText && (
          <View style={styles.topTextContainer}>
            <Text style={[styles.memeText, { fontFamily, color: textColor }]}>
              {topText.toUpperCase()}
            </Text>
          </View>
        )}
        
        {bottomText && (
          <View style={styles.bottomTextContainer}>
            <Text style={[styles.memeText, { fontFamily, color: textColor }]}>
              {bottomText.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.inputContainer}>
          <Type size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Top text"
            placeholderTextColor={theme.colors.textSecondary}
            value={topText}
            onChangeText={onTopTextChange}
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
            onChangeText={onBottomTextChange}
            maxLength={50}
          />
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generatingButton]}
          onPress={generateMeme}
          disabled={isGenerating}
        >
          <Wand2 size={20} color={theme.colors.surface} />
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Generating...' : 'Generate Meme'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  memeContainer: {
    position: 'relative',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  memeImage: {
    width: '100%',
    aspectRatio: 1,
  },
  topTextContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  memeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    lineHeight: 28,
    paddingHorizontal: 8,
  },
  controls: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  generatingButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.surface,
    marginLeft: 8,
  },
});