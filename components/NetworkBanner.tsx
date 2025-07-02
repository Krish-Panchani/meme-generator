import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNetwork } from '@/contexts/NetworkContext';

export function NetworkBanner() {
  const { theme } = useTheme();
  const { isConnected } = useNetwork();

  if (isConnected) return null;

  const styles = createStyles(theme);

  return (
    <View style={styles.banner}>
      <WifiOff size={16} color={theme.colors.surface} />
      <Text style={styles.bannerText}>
        You're offline. Some features may be limited.
      </Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bannerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.surface,
    marginLeft: 8,
  },
});