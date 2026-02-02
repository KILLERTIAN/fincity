import { FontSizes } from '@/constants/theme';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FloatingCoinsProps {
  count?: number;
  duration?: number;
}

export const FloatingCoins: React.FC<FloatingCoinsProps> = ({
  count = 5,
  duration = 3000,
}) => {
  const coins = Array.from({ length: count }, (_, index) => ({
    id: index,
    delay: index * 200,
    startX: Math.random() * width * 0.8,
  }));

  return (
    <View style={styles.container}>
      {coins.map((coin) => (
        <FloatingCoin
          key={coin.id}
          delay={coin.delay}
          startX={coin.startX}
          duration={duration}
        />
      ))}
    </View>
  );
};

interface FloatingCoinProps {
  delay: number;
  startX: number;
  duration: number;
}

const FloatingCoin: React.FC<FloatingCoinProps> = ({
  delay,
  startX,
  duration,
}) => {
  const translateY = useSharedValue(height);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      translateY.value = withTiming(-100, {
        duration,
        easing: Easing.out(Easing.quad),
      });
      
      translateX.value = withTiming(
        startX + (Math.random() - 0.5) * 100,
        {
          duration,
          easing: Easing.inOut(Easing.quad),
        }
      );
      
      rotate.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
      
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(1, { duration: duration - 600 }),
        withTiming(0, { duration: 300 })
      );
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [delay, duration, startX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.coin, animatedStyle]}>
      <Text style={styles.coinText}>💰</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  coin: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: {
    fontSize: FontSizes.lg,
  },
});