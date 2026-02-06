import { BorderRadius, FontSizes, GameColors, Spacing } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface AnimatedMoneyDisplayProps {
  amount: number;
  previousAmount?: number;
  showAnimation?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showCurrency?: boolean;
  glowEffect?: boolean;
}

export const AnimatedMoneyDisplay: React.FC<AnimatedMoneyDisplayProps> = ({
  amount,
  previousAmount = 0,
  showAnimation = true,
  size = 'medium',
  showCurrency = true,
  glowEffect = true,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const rotateX = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  const colorIntensity = useSharedValue(0);

  const difference = amount - previousAmount;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  useEffect(() => {
    if (showAnimation && difference !== 0) {
      // Main scale animation
      scale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );

      // 3D flip effect for dramatic changes
      if (Math.abs(difference) > 20) {
        rotateX.value = withSequence(
          withTiming(90, { duration: 200 }),
          withTiming(0, { duration: 200 })
        );
      }

      // Vertical bounce
      translateY.value = withSequence(
        withSpring(isIncrease ? -15 : 15, { damping: 8 }),
        withSpring(0, { damping: 12 })
      );

      // Glow effect
      if (glowEffect) {
        glowIntensity.value = withSequence(
          withTiming(1, { duration: 300 }),
          withDelay(500, withTiming(0, { duration: 800 }))
        );
      }

      // Color change effect
      colorIntensity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(1000, withTiming(0, { duration: 500 }))
      );
    }
  }, [amount, difference, isIncrease, showAnimation, glowEffect]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotateX: `${rotateX.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => {
    const glowScale = interpolate(glowIntensity.value, [0, 1], [1, 1.2]);
    const glowOpacity = interpolate(glowIntensity.value, [0, 1], [0, 0.6]);

    return {
      transform: [{ scale: glowScale }],
      opacity: glowOpacity,
    };
  });

  const colorStyle = useAnimatedStyle(() => {
    const colorOpacity = interpolate(colorIntensity.value, [0, 1], [0, 0.8]);
    return {
      opacity: colorOpacity,
    };
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: FontSizes.lg, padding: Spacing.sm };
      case 'large':
        return { fontSize: FontSizes.xxxl, padding: Spacing.lg };
      case 'xlarge':
        return { fontSize: 48, padding: Spacing.xl };
      default:
        return { fontSize: FontSizes.xxl, padding: Spacing.md };
    }
  };

  const sizeStyles = getSizeStyles();
  const formattedAmount = showCurrency ? `₹${amount.toLocaleString()}` : amount.toLocaleString();

  return (
    <View style={styles.container}>
      {/* Glow effect background */}
      {glowEffect && (
        <Animated.View
          style={[
            styles.glowBackground,
            {
              backgroundColor: isIncrease ? GameColors.moneyGreen :
                isDecrease ? GameColors.moneyRed : GameColors.buttonPrimary,
            },
            glowStyle,
          ]}
        />
      )}

      {/* Color change overlay */}
      <Animated.View
        style={[
          styles.colorOverlay,
          {
            backgroundColor: isIncrease ? GameColors.moneyGreen :
              isDecrease ? GameColors.moneyRed : 'transparent',
          },
          colorStyle,
        ]}
      />

      {/* Main money display */}
      <Animated.View style={[styles.moneyContainer, animatedStyle]}>
        <LinearGradient
          colors={[GameColors.textWhite, '#F8F9FA']}
          style={[
            styles.moneyBackground,
            {
              padding: sizeStyles.padding,
            },
          ]}
        >
          <Text
            style={[
              styles.moneyText,
              {
                fontSize: sizeStyles.fontSize,
                color: GameColors.textPrimary,
              },
            ]}
          >
            {formattedAmount}
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Floating difference indicator */}
      {showAnimation && difference !== 0 && (
        <FloatingDifference
          difference={difference}
          isIncrease={isIncrease}
          showCurrency={showCurrency}
        />
      )}
    </View>
  );
};

interface FloatingDifferenceProps {
  difference: number;
  isIncrease: boolean;
  showCurrency: boolean;
}

const FloatingDifference: React.FC<FloatingDifferenceProps> = ({
  difference,
  isIncrease,
  showCurrency,
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15 });

    translateY.value = withSequence(
      withTiming(isIncrease ? -30 : 30, { duration: 400 }),
      withTiming(isIncrease ? -60 : 60, { duration: 800 })
    );

    opacity.value = withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 800 })
    );
  }, [difference, isIncrease]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const formattedDifference = showCurrency
    ? `${isIncrease ? '+' : ''}₹${Math.abs(difference).toLocaleString()}`
    : `${isIncrease ? '+' : ''}${Math.abs(difference).toLocaleString()}`;

  return (
    <Animated.View style={[styles.differenceContainer, animatedStyle]}>
      <LinearGradient
        colors={isIncrease
          ? [GameColors.moneyGreen, '#27AE60']
          : [GameColors.moneyRed, '#C0392B']
        }
        style={styles.differenceBackground}
      >
        <Text style={styles.differenceText}>
          {formattedDifference}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowBackground: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: BorderRadius.full,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  colorOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
  },
  moneyContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  moneyBackground: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moneyText: {
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  differenceContainer: {
    position: 'absolute',
    top: -20,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  differenceBackground: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  differenceText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: GameColors.textWhite,
    textAlign: 'center',
  },
});