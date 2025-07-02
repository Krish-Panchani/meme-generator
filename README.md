# 🎭 Meme Generator Pro

A production-ready, feature-rich meme generator built with Expo and React Native. Create, customize, save, and share memes with offline capabilities and advanced customization options.

## ✨ Features

### 🎨 **Meme Creation**
- **Multiple Image Sources**: Choose from device gallery, camera, or URL
- **Popular Templates**: Pre-loaded popular meme templates from Pexels
- **Real-time Preview**: See your meme as you type
- **Custom Text**: Add top and bottom text with live preview
- **Font Customization**: Choose from multiple Inter font weights
- **Color Customization**: 8 different text colors to choose from

### 💾 **Advanced Storage & Management**
- **Local Storage**: All memes saved locally using AsyncStorage
- **Favorites System**: Mark memes as favorites for quick access
- **Edit Saved Memes**: Modify text on previously created memes
- **Bulk Operations**: Clear all memes with confirmation
- **Persistent Settings**: Font and color preferences saved across sessions

### 🌐 **Offline Capabilities**
- **Full Offline Mode**: Create memes without internet connection
- **Network Status Indicator**: Visual banner when offline
- **Cached Images**: Previously loaded images work offline
- **Local Image Processing**: All meme generation happens locally

### 🎯 **User Experience**
- **Guided Workflow**: 3-step process with visual indicators
- **Responsive Design**: Works on all screen sizes
- **Dark/Light Theme**: Automatic theme switching with manual override
- **Haptic Feedback**: Tactile feedback on mobile devices
- **Smooth Animations**: Polished micro-interactions

### 📱 **Sharing & Export**
- **Native Sharing**: Share memes using device's share sheet
- **Camera Roll Save**: Download memes directly to device
- **High Quality Export**: PNG format with optimized quality
- **Cross-platform**: Works on iOS, Android, and Web

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g @expo/cli`
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meme-generator-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   - **Web**: Open http://localhost:8081 in your browser
   - **iOS**: Press `i` in terminal or scan QR code with Expo Go
   - **Android**: Press `a` in terminal or scan QR code with Expo Go

## 📱 Platform Support

| Platform | Status | Features |
|----------|--------|----------|
| **Web** | ✅ Full Support | All features except camera and haptics |
| **iOS** | ✅ Full Support | All features including camera and haptics |
| **Android** | ✅ Full Support | All features including camera and haptics |

## 🏗️ Architecture

### **Tech Stack**
- **Framework**: Expo SDK 52.0.30
- **Navigation**: Expo Router 4.0.17
- **UI**: React Native with custom styling
- **Storage**: AsyncStorage for persistence
- **Images**: Expo Image with caching
- **Icons**: Lucide React Native
- **Fonts**: Expo Google Fonts (Inter family)

### **Project Structure**
```
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with providers
│   ├── (tabs)/           # Tab-based navigation
│   │   ├── _layout.tsx   # Tab configuration
│   │   ├── index.tsx     # Create meme screen
│   │   ├── saved.tsx     # Saved memes screen
│   │   └── settings.tsx  # Settings screen
│   └── +not-found.tsx    # 404 page
├── components/            # Reusable components
│   ├── ImageSelector.tsx # Image selection component
│   ├── MemeEditor.tsx    # Meme creation interface
│   ├── MemeModal.tsx     # Meme detail modal
│   ├── EditMemeModal.tsx # Edit meme modal
│   ├── FontSelector.tsx  # Font selection component
│   ├── ColorSelector.tsx # Color selection component
│   ├── NetworkBanner.tsx # Offline indicator
│   └── LoadingSpinner.tsx# Loading component
├── contexts/             # React contexts
│   ├── ThemeContext.tsx  # Theme management
│   ├── MemeContext.tsx   # Meme data management
│   └── NetworkContext.tsx# Network status
└── hooks/                # Custom hooks
    └── useFrameworkReady.ts
```


## 📊 Features Deep Dive

### **Meme Creation Workflow**

1. **Image Selection**
   - Device gallery with permission handling
   - Camera capture (mobile only)
   - URL input with validation
   - Popular templates grid

2. **Text Customization**
   - Top and bottom text inputs
   - Real-time preview updates
   - Font family selection
   - Text color customization
   - Character limits (50 chars)

3. **Generation & Export**
   - High-quality PNG generation
   - View capture technology
   - Optimized file sizes
   - Multiple export options

### **Storage System**

```typescript
interface Meme {
  id: string;
  imageUri: string;      // Original image
  memeUri: string;       // Generated meme
  topText: string;
  bottomText: string;
  createdAt: string;
  isFavorite: boolean;
  fontFamily?: string;
  textColor?: string;
}
```

### **Offline Capabilities**

- **Network Detection**: Real-time connectivity monitoring
- **Graceful Degradation**: Features adapt to offline state
- **Local Processing**: All core features work offline
- **Cache Management**: Intelligent image caching

## 🚀 Deployment

### **Web Deployment**
```bash
npm run build:web
# Deploy the dist folder to your hosting provider
```

### **Mobile Deployment**
1. **Development Build**
   ```bash
   expo install expo-dev-client
   expo run:ios
   expo run:android
   ```

2. **Production Build**
   ```bash
   eas build --platform all
   eas submit --platform all
   ```

---

**Made with ❤️ by Krish Panchani**
