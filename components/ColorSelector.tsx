import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = [
  '#FFFFFF', // White
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
];

export function ColorSelector() {
  const { theme } = useTheme();
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  React.useEffect(() => {
    loadColorPreference();
  }, []);

  const loadColorPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('preferred_text_color');
      if (saved) {
        setSelectedColor(saved);
      }
    } catch (error) {
      console.error('Failed to load color preference:', error);
    }
  };

  const handleColorSelect = async (color: string) => {
    setSelectedColor(color);
    try {
      await AsyncStorage.setItem('preferred_text_color', color);
    } catch (error) {
      console.error('Failed to save color preference:', error);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor
            ]}
            onPress={() => handleColorSelect(color)}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  selectedColor: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
});