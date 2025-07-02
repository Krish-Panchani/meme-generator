import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Heart, Trash2, CreditCard as Edit3, Share2, Star } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useMeme } from '@/contexts/MemeContext';
import { NetworkBanner } from '@/components/NetworkBanner';
import { MemeModal } from '@/components/MemeModal';
import { EditMemeModal } from '@/components/EditMemeModal';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function SavedScreen() {
  const { theme } = useTheme();
  const { memes, toggleFavorite, deleteMeme, updateMeme, refreshMemes } = useMeme();
  const [selectedMeme, setSelectedMeme] = useState<any>(null);
  const [editingMeme, setEditingMeme] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredMemes = memes.filter(meme => 
    filter === 'all' || (filter === 'favorites' && meme.isFavorite)
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshMemes();
    setRefreshing(false);
  }, [refreshMemes]);

  const handleToggleFavorite = async (memeId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await toggleFavorite(memeId);
  };

  const handleDeleteMeme = (memeId: string) => {
    Alert.alert(
      'Delete Meme',
      'Are you sure you want to delete this meme?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            await deleteMeme(memeId);
          }
        }
      ]
    );
  };

  const handleShare = async (memeUri: string) => {
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

  const renderMemeItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.memeItem}
      onPress={() => setSelectedMeme(item)}
      activeOpacity={0.7}
    >
      <View style={styles.memeImageContainer}>
        <Image
          source={{ uri: item.memeUri }}
          style={styles.memeImage}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        {item.isFavorite && (
          <View style={styles.favoriteIndicator}>
            <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
          </View>
        )}
      </View>
      
      <View style={styles.memeInfo}>
        <Text style={styles.memeText} numberOfLines={1}>
          {item.topText || 'No top text'}
        </Text>
        <Text style={styles.memeText} numberOfLines={1}>
          {item.bottomText || 'No bottom text'}
        </Text>
        <Text style={styles.memeDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.memeActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleFavorite(item.id)}
        >
          <Heart
            size={20}
            color={item.isFavorite ? theme.colors.error : theme.colors.textSecondary}
            fill={item.isFavorite ? theme.colors.error : 'none'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setEditingMeme(item)}
        >
          <Edit3 size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(item.memeUri)}
        >
          <Share2 size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteMeme(item.id)}
        >
          <Trash2 size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <NetworkBanner />
      
      <View style={styles.header}>
        <Text style={styles.title}>Saved Memes</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.activeFilterButton
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText
            ]}>
              All ({memes.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'favorites' && styles.activeFilterButton
            ]}
            onPress={() => setFilter('favorites')}
          >
            <Text style={[
              styles.filterText,
              filter === 'favorites' && styles.activeFilterText
            ]}>
              Favorites ({memes.filter(m => m.isFavorite).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredMemes.length === 0 ? (
        <ScrollView 
          contentContainerStyle={styles.emptyStateContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <View style={styles.emptyState}>
            <Heart size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>
              {filter === 'all' ? 'No memes saved yet' : 'No favorite memes yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' 
                ? 'Create your first meme to see it here' 
                : 'Mark memes as favorites to see them here'
              }
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredMemes}
          renderItem={renderMemeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {selectedMeme && (
        <MemeModal
          meme={selectedMeme}
          visible={!!selectedMeme}
          onClose={() => setSelectedMeme(null)}
        />
      )}

      {editingMeme && (
        <EditMemeModal
          meme={editingMeme}
          visible={!!editingMeme}
          onClose={() => setEditingMeme(null)}
          onSave={updateMeme}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
  activeFilterText: {
    color: theme.colors.surface,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  memeItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  memeImageContainer: {
    position: 'relative',
  },
  memeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  favoriteIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 2,
  },
  memeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  memeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.text,
    marginBottom: 2,
  },
  memeDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  memeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyStateContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});