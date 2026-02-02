import { BorderRadius, FontSizes, GameColors, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const translateY = useSharedValue(0);

  const handlePressIn = () => {
    if (!disabled) {
      translateY.value = withSpring(4, { damping: 20, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: disabled ? 0.6 : 1,
  }));

  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return { top: GameColors.secondary, bottom: GameColors.secondaryDark };
      case 'success':
        return { top: GameColors.primary, bottom: GameColors.primaryDark };
      case 'warning':
        return { top: GameColors.warning, bottom: GameColors.warningDark };
      default:
        return { top: GameColors.primary, bottom: GameColors.primaryDark };
    }
  };

  const colors = getColors();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.xs,
          fontSize: FontSizes.sm,
          height: 40,
        };
      case 'large':
        return {
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.md,
          fontSize: FontSizes.xl,
          height: 64,
        };
      default:
        return {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          fontSize: FontSizes.md,
          height: 52,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, { height: sizeStyles.height }, style]}
    >
      {/* Bottom Layer (Shadow/Depth) */}
      <View
        style={[
          styles.bottomLayer,
          { backgroundColor: colors.bottom, borderRadius: BorderRadius.md },
        ]}
      />
      {/* Top Layer (Button Surface) */}
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: colors.top,
            borderRadius: BorderRadius.md,
            paddingHorizontal: sizeStyles.paddingHorizontal,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.text,
            { fontSize: sizeStyles.fontSize },
            textStyle,
          ]}
        >
          {title.toUpperCase()}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minWidth: 120,
  },
  bottomLayer: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
  },
  text: {
    color: GameColors.white,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});