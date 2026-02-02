import { BorderRadius, FontSizes, GameColors, Spacing } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface MorphingButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  morphOnPress?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const MorphingButton: React.FC<MorphingButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  icon,
  morphOnPress = true,
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const borderRadius = useSharedValue(BorderRadius.md);
  const shadowOpacity = useSharedValue(0.3);
  const glowIntensity = useSharedValue(0);

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(0.6, { duration: 150 });
      glowIntensity.value = withTiming(1, { duration: 150 });

      if (morphOnPress) {
        borderRadius.value = withSpring(BorderRadius.full, { damping: 15 });
        rotation.value = withSpring(5, { damping: 15 });
      }
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(0.3, { duration: 150 });
      glowIntensity.value = withTiming(0, { duration: 300 });

      if (morphOnPress) {
        borderRadius.value = withSpring(BorderRadius.md, { damping: 15 });
        rotation.value = withSpring(0, { damping: 15 });
      }
    }
  };

  const handlePress = () => {
    if (!disabled) {
      // Success animation
      scale.value = withSequence(
        withTiming(1.1, { duration: 100 }),
        withSpring(1, { damping: 15 })
      );

      rotation.value = withSequence(
        withTiming(360, { duration: 400 }),
        withTiming(0, { duration: 0 })
      );

      runOnJS(onPress)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    borderRadius: borderRadius.value,
    shadowOpacity: disabled ? 0.1 : shadowOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => {
    const glowScale = interpolate(glowIntensity.value, [0, 1], [1, 1.05]);
    const glowOpacity = interpolate(glowIntensity.value, [0, 1], [0, 0.4]);

    return {
      transform: [{ scale: glowScale }],
      opacity: glowOpacity,
    };
  });

  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return [GameColors.buttonSecondary, GameColors.gradientMiddle];
      case 'success':
        return [GameColors.buttonSuccess, '#27AE60'];
      case 'warning':
        return [GameColors.buttonWarning, '#E67E22'];
      case 'danger':
        return [GameColors.moneyRed, '#C0392B'];
      default:
        return [GameColors.buttonPrimary, GameColors.gradientStart];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          fontSize: FontSizes.sm,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingHorizontal: Spacing.xxl,
          paddingVertical: Spacing.lg,
          fontSize: FontSizes.xl,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          fontSize: FontSizes.md,
          minHeight: 48,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const gradientColors = getVariantColors();

  return (
    <AnimatedPressable
      style={[styles.container, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: gradientColors[0],
            shadowColor: gradientColors[0],
          },
          glowStyle,
        ]}
      />

      {/* Button gradient */}
      <AnimatedLinearGradient
        colors={(disabled ? ['#BDC3C7', '#95A5A6'] : gradientColors) as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            minHeight: sizeStyles.minHeight,
          },
          animatedStyle,
        ]}
      >
        {icon && (
          <Text style={[styles.icon, { fontSize: sizeStyles.fontSize }]}>
            {icon}
          </Text>
        )}
        <Text
          style={[
            styles.text,
            { fontSize: sizeStyles.fontSize },
            textStyle,
            { opacity: disabled ? 0.6 : 1 },
          ]}
        >
          {title}
        </Text>
      </AnimatedLinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: BorderRadius.md + 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  text: {
    color: GameColors.textWhite,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});