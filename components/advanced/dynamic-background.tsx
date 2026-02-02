import { GameColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DynamicBackgroundProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'playful';
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  children,
  variant = 'default',
}) => {
  const getGradientColors = (): [string, string, ...string[]] => {
    switch (variant) {
      case 'success':
        return [GameColors.moneyGreen, GameColors.buttonSecondary, GameColors.gradientEnd];
      case 'warning':
        return [GameColors.buttonWarning, GameColors.gradientStart, GameColors.gradientMiddle];
      case 'playful':
        return ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4'];
      default:
        return [GameColors.gradientStart, GameColors.gradientMiddle, GameColors.gradientEnd];
    }
  };

  return (
    <View style={styles.container}>
      {/* Simple gradient background - stable for iOS */}
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});