import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface PulseAnimationProps {
  children: React.ReactNode;
  duration?: number;
  minScale?: number;
  maxScale?: number;
  style?: ViewStyle;
  enabled?: boolean;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  duration = 2000,
  minScale = 0.95,
  maxScale = 1.05,
  style,
  enabled = true,
}) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    if (enabled) {
      animationValue.value = withRepeat(
        withTiming(1, { duration }),
        -1,
        true
      );
    } else {
      animationValue.value = withTiming(0, { duration: 300 });
    }
  }, [enabled, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [0, 1],
      [minScale, maxScale]
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};