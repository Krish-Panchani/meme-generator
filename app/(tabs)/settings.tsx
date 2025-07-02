import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Moon, 
  Sun, 
  Palette, 
  Type, 
  Download, 
  Trash2, 
  Info,
  ChevronRight 
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useMeme } from '@/contexts/MemeContext';
import { NetworkBanner } from '@/components/NetworkBanner';
import { FontSelector } from '@/components/FontSelector';
import { ColorSelector } from '@/components/ColorSelector';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { clearAllMemes, memes } = useMeme();

  const handleToggleTheme = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleTheme();
  };

  const handleClearAllMemes = () => {
    Alert.alert(
      'Clear All Memes',
      `Are you sure you want to delete all ${memes.length} saved memes? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
            await clearAllMemes();
            Alert.alert('Success', 'All memes have been deleted');
          }
        }
      ]
    );
  };

  const showAppInfo = () => {
    Alert.alert(
      'Meme Generator Pro',
      'Version 1.0.0\n\nA production-ready meme generator with offline capabilities, image caching, and advanced meme management features.\n\nBuilt with Expo and React Native.',
      [{ text: 'OK' }]
    );
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <NetworkBanner />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your meme experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleToggleTheme}>
            <View style={styles.settingLeft}>
              {isDarkMode ? (
                <Moon size={24} color={theme.colors.text} />
              ) : (
                <Sun size={24} color={theme.colors.text} />
              )}
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Theme</Text>
                <Text style={styles.settingSubtitle}>
                  {isDarkMode ? 'Dark mode' : 'Light mode'}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meme Customization</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Type size={24} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Font Style</Text>
                <Text style={styles.settingSubtitle}>Choose your preferred font</Text>
              </View>
            </View>
          </View>
          <FontSelector />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Palette size={24} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Text Color</Text>
                <Text style={styles.settingSubtitle}>Choose your preferred text color</Text>
              </View>
            </View>
          </View>
          <ColorSelector />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Download size={24} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Saved Memes</Text>
                <Text style={styles.settingSubtitle}>
                  {memes.length} memes saved locally
                </Text>
              </View>
            </View>
          </View>

          {memes.length > 0 && (
            <TouchableOpacity style={styles.settingItem} onPress={handleClearAllMemes}>
              <View style={styles.settingLeft}>
                <Trash2 size={24} color={theme.colors.error} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: theme.colors.error }]}>
                    Clear All Memes
                  </Text>
                  <Text style={styles.settingSubtitle}>
                    Delete all saved memes
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={showAppInfo}>
            <View style={styles.settingLeft}>
              <Info size={24} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>App Information</Text>
                <Text style={styles.settingSubtitle}>Version and details</Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ using Expo and React Native
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 1,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});