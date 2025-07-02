import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fonts = [
  { name: 'Inter Bold', value: 'Inter-Bold' },
  { name: 'Inter SemiBold', value: 'Inter-SemiBold' },
  { name: 'Inter Medium', value: 'Inter-Medium' },
  { name: 'Inter Regular', value: 'Inter-Regular' },
];

export function FontSelector() {
  const { theme } = useTheme();
  const [selectedFont, setSelectedFont] = useState('Inter-Bold');

  React.useEffect(() => {
    loadFontPreference();
  }, []);

  const loadFontPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('preferred_font');
      if (saved) {
        setSelectedFont(saved);
      }
    } catch (error) {
      console.error('Failed to load font preference:', error);
    }
  };

  const handleFontSelect = async (fontValue: string) => {
    setSelectedFont(fontValue);
    try {
      await AsyncStorage.setItem('preferred_font', fontValue);
    } catch (error) {
      console.error('Failed to save font preference:', error);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {fonts.map((font) => (
        <TouchableOpacity
          key={font.value}
          style={[
            styles.fontOption,
            selectedFont === font.value && styles.selectedFont
          ]}
          onPress={() => handleFontSelect(font.value)}
        >
          <Text style={[styles.fontText, { fontFamily: font.value }]}>
            {font.name}
          </Text>
          <Text style={[styles.previewText, { fontFamily: font.value }]}>
            Sample Text
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  fontOption: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFont: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  fontText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});