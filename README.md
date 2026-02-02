# FinCity - Kids Financial Game 🎮💰

A multiplayer financial literacy game designed to teach kids about money management through fun, interactive gameplay and social features.

## 🌟 Features

### 🎨 Kid-Friendly UI
- **Vibrant gradient backgrounds** with smooth animations
- **Playful color scheme** with coral, turquoise, and sky blue gradients
- **Smooth money counter animations** with roll-up/roll-down effects
- **Interactive cards and buttons** with haptic feedback
- **Floating coin animations** for purchases and rewards

### 💰 Core Game Mechanics
- **Virtual allowance system** with real-time money tracking
- **Daily expenses** (lunch, bus fare, school supplies)
- **Savings goals** with visual progress bars
- **Trust/reputation system** based on financial behavior
- **Transaction history** with animated feedback

### 👥 Social Features
- **Friends list** with online/offline status
- **Friend search and discovery**
- **Social financial interactions** (lending, borrowing, helping)
- **Activity feed** showing friends' financial achievements

### 🛍️ Game Store
- **Avatar customization** items
- **Power-ups and boosters** for enhanced gameplay
- **Decorative themes** and visual upgrades
- **Daily deals** and featured items
- **Animated purchase effects** with floating coins

## 🏗️ Technical Architecture

### 📱 Built with Expo & React Native
- **Expo Router** for navigation
- **React Native Reanimated** for smooth animations
- **TypeScript** for type safety
- **Context API** for state management

### 🎭 Animation System
- **Money counter animations** with spring physics
- **Gradient background animations** with subtle movement
- **Interactive button animations** with scale and opacity effects
- **Floating coin effects** for visual feedback
- **Pulse animations** for important elements

### 🎨 Design System
- **Consistent color palette** with game-appropriate colors
- **Responsive spacing system** for different screen sizes
- **Modular component architecture** for reusability
- **Haptic feedback** for enhanced user experience

## 📁 Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen with dashboard
│   │   ├── explore.tsx        # Friends and social features
│   │   └── shop.tsx           # Game store and purchases
│   └── _layout.tsx            # Root layout with providers
├── components/
│   ├── animated/
│   │   ├── gradient-background.tsx
│   │   ├── money-counter.tsx
│   │   ├── floating-coins.tsx
│   │   └── pulse-animation.tsx
│   └── ui/
│       ├── game-card.tsx
│       ├── game-button.tsx
│       └── friend-card.tsx
├── contexts/
│   └── game-context.tsx      # Global game state management
└── constants/
    └── theme.ts              # Colors, spacing, and design tokens
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on device/simulator**
   - Scan QR code with Expo Go (mobile)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 🎯 Game Features

### Home Screen
- **Player dashboard** with current money and trust score
- **Quick action buttons** for earning/spending money
- **Daily expenses** with interactive payment buttons
- **Savings goal tracker** with visual progress
- **Recent transaction history** with animated updates
- **Reputation badges** and achievements

### Friends Screen
- **Friends list** with online status indicators
- **Search functionality** for finding friends
- **Add friend feature** with username search
- **Quick actions** for lending money and requesting help
- **Recent activity feed** showing social interactions

### Shop Screen
- **Featured items** with special promotions
- **Categorized items** (Avatar, Power-ups, Decorations)
- **Purchase animations** with floating coins
- **Affordability indicators** with dynamic pricing
- **Daily deals** section with limited-time offers

## 🎮 Educational Goals

- **Budgeting skills** through daily expense management
- **Saving habits** with goal-oriented progress tracking
- **Social responsibility** via lending and helping mechanics
- **Trust building** through reputation system
- **Decision making** with consequence-based gameplay

## 🔮 Future Enhancements

- **Multiplayer real-time features** with WebSocket integration
- **Parental dashboard** for monitoring and allowance setting
- **Achievement system** with unlockable rewards
- **Mini-games** for earning extra money
- **Educational content** integrated into gameplay
- **Push notifications** for friend interactions and reminders

## 🎨 Design Philosophy

The app follows a **kid-friendly design approach** with:
- **Bright, engaging colors** that appeal to children
- **Large, easy-to-tap buttons** for accessibility
- **Clear visual hierarchy** with intuitive navigation
- **Immediate feedback** through animations and haptics
- **Gamification elements** to maintain engagement
- **Safe social features** with parental oversight

---

Built with ❤️ for teaching kids financial literacy through play!