import { BorderRadius, GameColors, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blurIntensity?: number;
  glowColor?: string;
  animated?: boolean;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  style,
  blurIntensity = 20,
  glowColor = GameColors.buttonPrimary,
  animated = true,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    if (animated) {
      // Subtle breathing animation
      scale.value = withSpring(1.02, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 800 });
      
      // Glow pulse effect
      const pulseGlow = () => {
        glowOpacity.value = withTiming(0.6, { duration: 2000 }, () => {
          glowOpacity.value = withTiming(0.3, { duration: 2000 }, pulseGlow);
        });
      };
      pulseGlow();
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {/* Glow effect */}
      <Animated.View 
        style={[
          styles.glow, 
          { 
            backgroundColor: glowColor,
            shadowColor: glowColor,
          },
          glowStyle
        ]} 
      />
      
      {/* Glass effect - safe alternative to BlurView */}
      <View style={styles.glassEffect}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: BorderRadius.xl + 4,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glassEffect: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.lg,
  },
});