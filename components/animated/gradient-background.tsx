import { GameColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface GradientBackgroundProps {
  children?: React.ReactNode;
  animated?: boolean;
  colors?: string[];
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  animated = true,
  colors = [GameColors.gradientStart, GameColors.gradientMiddle, GameColors.gradientEnd],
}) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animationValue.value = withRepeat(
        withTiming(1, { duration: 8000 }),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!animated) return {};

    const translateX = interpolate(
      animationValue.value,
      [0, 1],
      [-width * 0.1, width * 0.1]
    );

    const translateY = interpolate(
      animationValue.value,
      [0, 1],
      [-height * 0.05, height * 0.05]
    );

    return {
      transform: [
        { translateX },
        { translateY },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gradientContainer, animatedStyle]}>
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
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
  gradientContainer: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.1,
    right: -width * 0.1,
    bottom: -height * 0.1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});