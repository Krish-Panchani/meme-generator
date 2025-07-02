import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Meme {
  id: string;
  imageUri: string;
  memeUri: string;
  topText: string;
  bottomText: string;
  createdAt: string;
  isFavorite: boolean;
  fontFamily?: string;
  textColor?: string;
}

interface MemeContextType {
  memes: Meme[];
  saveMeme: (meme: Meme) => Promise<void>;
  deleteMeme: (id: string) => Promise<void>;
  updateMeme: (meme: Meme) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearAllMemes: () => Promise<void>;
  refreshMemes: () => Promise<void>;
}

const MemeContext = createContext<MemeContextType | undefined>(undefined);

const STORAGE_KEY = 'saved_memes';

export function MemeProvider({ children }: { children: React.ReactNode }) {
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    loadMemes();
  }, []);

  const loadMemes = async () => {
    try {
      const savedMemes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedMemes) {
        const parsedMemes = JSON.parse(savedMemes);
        setMemes(parsedMemes.sort((a: Meme, b: Meme) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to load memes:', error);
    }
  };

  const saveMemes = async (memesToSave: Meme[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(memesToSave));
    } catch (error) {
      console.error('Failed to save memes:', error);
      throw error;
    }
  };

  const saveMeme = async (meme: Meme) => {
    const updatedMemes = [meme, ...memes];
    setMemes(updatedMemes);
    await saveMemes(updatedMemes);
  };

  const deleteMeme = async (id: string) => {
    const updatedMemes = memes.filter(meme => meme.id !== id);
    setMemes(updatedMemes);
    await saveMemes(updatedMemes);
  };

  const updateMeme = async (updatedMeme: Meme) => {
    const updatedMemes = memes.map(meme => 
      meme.id === updatedMeme.id ? updatedMeme : meme
    );
    setMemes(updatedMemes);
    await saveMemes(updatedMemes);
  };

  const toggleFavorite = async (id: string) => {
    const updatedMemes = memes.map(meme => 
      meme.id === id ? { ...meme, isFavorite: !meme.isFavorite } : meme
    );
    setMemes(updatedMemes);
    await saveMemes(updatedMemes);
  };

  const clearAllMemes = async () => {
    setMemes([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const refreshMemes = async () => {
    await loadMemes();
  };

  return (
    <MemeContext.Provider value={{
      memes,
      saveMeme,
      deleteMeme,
      updateMeme,
      toggleFavorite,
      clearAllMemes,
      refreshMemes,
    }}>
      {children}
    </MemeContext.Provider>
  );
}

export function useMeme() {
  const context = useContext(MemeContext);
  if (context === undefined) {
    throw new Error('useMeme must be used within a MemeProvider');
  }
  return context;
}