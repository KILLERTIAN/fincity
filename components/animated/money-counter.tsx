import { FontSizes, GameColors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface MoneyCounterProps {
  amount: number;
  previousAmount?: number;
  showAnimation?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const MoneyCounter: React.FC<MoneyCounterProps> = ({
  amount,
  previousAmount = 0,
  showAnimation = true,
  size = 'medium',
  color,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotateX = useSharedValue(0);

  const difference = amount - previousAmount;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  useEffect(() => {
    if (showAnimation && difference !== 0) {
      // Money roll animation
      scale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 8 })
      );

      // Roll up/down effect
      translateY.value = withSequence(
        withTiming(isIncrease ? -10 : 10, { duration: 200 }),
        withTiming(0, { duration: 300 })
      );

      // 3D flip effect for dramatic changes
      if (Math.abs(difference) > 50) {
        rotateX.value = withSequence(
          withTiming(90, { duration: 150 }),
          withTiming(0, { duration: 150 })
        );
      }
    }
  }, [amount, difference, isIncrease, showAnimation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
        { rotateX: `${rotateX.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: FontSizes.md };
      case 'large':
        return { fontSize: FontSizes.xxxl };
      default:
        return { fontSize: FontSizes.xl };
    }
  };

  const getAmountColor = () => {
    if (color) return color;
    if (amount > 0) return GameColors.moneyGreen;
    if (amount < 0) return GameColors.moneyRed;
    return GameColors.textPrimary;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <Text style={[
          styles.amount,
          getSizeStyles(),
          { color: getAmountColor() }
        ]}>
          ₹{Math.abs(amount).toFixed(0)}
        </Text>
      </Animated.View>

      {/* Animated difference indicator */}
      {showAnimation && difference !== 0 && (
        <AnimatedDifference
          difference={difference}
          isIncrease={isIncrease}
        />
      )}
    </View>
  );
};

interface AnimatedDifferenceProps {
  difference: number;
  isIncrease: boolean;
}

const AnimatedDifference: React.FC<AnimatedDifferenceProps> = ({
  difference,
  isIncrease,
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withSequence(
      withTiming(isIncrease ? -20 : 20, { duration: 300 }),
      withTiming(isIncrease ? -40 : 40, { duration: 500 })
    );

    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 500 })
    );
  }, [difference]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.differenceContainer, animatedStyle]}>
      <Text style={[
        styles.differenceText,
        { color: isIncrease ? GameColors.moneyGreen : GameColors.moneyRed }
      ]}>
        {isIncrease ? '+' : ''}₹{Math.abs(difference).toFixed(0)}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  amount: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  differenceContainer: {
    position: 'absolute',
    top: -30,
  },
  differenceText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});