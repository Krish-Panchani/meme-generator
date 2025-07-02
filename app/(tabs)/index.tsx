import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Upload, Type, Download, Share2, Chrome as Home, RotateCcw } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { useMeme } from '@/contexts/MemeContext';
import { ImageSelector } from '@/components/ImageSelector';
import { MemeEditor } from '@/components/MemeEditor';
import { NetworkBanner } from '@/components/NetworkBanner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';

type FlowStep = 'select-image' | 'edit-meme' | 'meme-ready';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { isConnected } = useNetwork();
  const { saveMeme } = useMeme();
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-image');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [memeUri, setMemeUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelect = (uri: string) => {
    setSelectedImage(uri);
    setCurrentStep('edit-meme');
    setMemeUri(null);
  };

  const handleMemeGenerated = (uri: string) => {
    setMemeUri(uri);
    setCurrentStep('meme-ready');
  };

  const handleSaveMeme = async () => {
    if (!memeUri || !selectedImage) return;

    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const meme = {
        id: Date.now().toString(),
        imageUri: selectedImage,
        memeUri: memeUri,
        topText,
        bottomText,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };

      await saveMeme(meme);
      
      Alert.alert('Success', 'Meme saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save meme');
    }
  };

  const handleShare = async () => {
    if (!memeUri) return;

    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(memeUri);
      } else {
        Alert.alert('Share not available', 'Sharing is not available on this platform');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share meme');
    }
  };

  const handleDownload = async () => {
    if (!memeUri || Platform.OS === 'web') return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll access is required to save images');
        return;
      }

      await MediaLibrary.saveToLibraryAsync(memeUri);
      Alert.alert('Success', 'Meme saved to camera roll!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save to camera roll');
    }
  };

  const startNewMeme = () => {
    setCurrentStep('select-image');
    setSelectedImage(null);
    setMemeUri(null);
    setTopText('');
    setBottomText('');
  };

  const goBackToEdit = () => {
    setCurrentStep('edit-meme');
    setMemeUri(null);
  };

  const changeImage = () => {
    setCurrentStep('select-image');
    setSelectedImage(null);
    setMemeUri(null);
  };

  const styles = createStyles(theme);

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[
          styles.stepDot, 
          currentStep === 'select-image' ? styles.activeStep : styles.completedStep
        ]}>
          <Text style={styles.stepNumber}>1</Text>
        </View>
        <Text style={styles.stepLabel}>Select Image</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepContainer}>
        <View style={[
          styles.stepDot,
          currentStep === 'edit-meme' ? styles.activeStep : 
          currentStep === 'meme-ready' ? styles.completedStep : styles.inactiveStep
        ]}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
        <Text style={styles.stepLabel}>Add Text</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepContainer}>
        <View style={[
          styles.stepDot,
          currentStep === 'meme-ready' ? styles.activeStep : styles.inactiveStep
        ]}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
        <Text style={styles.stepLabel}>Save & Share</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <NetworkBanner />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Meme Generator</Text>
          <Text style={styles.subtitle}>Create amazing memes in seconds</Text>
          {renderStepIndicator()}
        </View>

        <View style={styles.content}>
          {currentStep === 'select-image' && (
            <ImageSelector onImageSelect={handleImageSelect} />
          )}

          {currentStep === 'edit-meme' && selectedImage && (
            <View style={styles.editorContainer}>
              <MemeEditor
                imageUri={selectedImage}
                topText={topText}
                bottomText={bottomText}
                onTopTextChange={setTopText}
                onBottomTextChange={setBottomText}
                onMemeGenerated={handleMemeGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />

              <View style={styles.editControls}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={changeImage}
                >
                  <Upload size={20} color={theme.colors.primary} />
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Change Image
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {currentStep === 'meme-ready' && memeUri && (
            <View style={styles.finalContainer}>
              <View style={styles.memePreview}>
                <Image
                  source={{ uri: memeUri }}
                  style={styles.finalMemeImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </View>

              <View style={styles.finalActions}>
                <Text style={styles.finalTitle}>Your meme is ready!</Text>
                <Text style={styles.finalSubtitle}>Save it, share it, or create another one</Text>

                <View style={styles.actionButtonsGrid}>
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleSaveMeme}
                  >
                    <Download size={20} color={theme.colors.surface} />
                    <Text style={[styles.buttonText, styles.primaryButtonText]}>
                      Save Meme
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleShare}
                  >
                    <Share2 size={20} color={theme.colors.surface} />
                    <Text style={[styles.buttonText, styles.primaryButtonText]}>
                      Share
                    </Text>
                  </TouchableOpacity>

                  {Platform.OS !== 'web' && (
                    <TouchableOpacity
                      style={[styles.button, styles.primaryButton]}
                      onPress={handleDownload}
                    >
                      <Download size={20} color={theme.colors.surface} />
                      <Text style={[styles.buttonText, styles.primaryButtonText]}>
                        Download
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={goBackToEdit}
                  >
                    <RotateCcw size={20} color={theme.colors.primary} />
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                      Edit Again
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.accentButton]}
                    onPress={startNewMeme}
                  >
                    <Home size={20} color={theme.colors.surface} />
                    <Text style={[styles.buttonText, styles.accentButtonText]}>
                      New Meme
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {isGenerating && <LoadingSpinner />}
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: theme.colors.primary,
  },
  completedStep: {
    backgroundColor: theme.colors.success,
  },
  inactiveStep: {
    backgroundColor: theme.colors.textSecondary,
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: theme.colors.surface,
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  editorContainer: {
    flex: 1,
  },
  editControls: {
    paddingTop: 20,
  },
  finalContainer: {
    flex: 1,
    alignItems: 'center',
  },
  memePreview: {
    width: '100%',
    maxWidth: 350,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  finalMemeImage: {
    width: '100%',
    height: '100%',
  },
  finalActions: {
    width: '100%',
    alignItems: 'center',
  },
  finalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  finalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  actionButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    maxWidth: 150,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    flex: 1,
  },
  accentButton: {
    backgroundColor: theme.colors.success,
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  primaryButtonText: {
    color: theme.colors.surface,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
  accentButtonText: {
    color: theme.colors.surface,
  },
});