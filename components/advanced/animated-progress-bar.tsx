import { FontSizes, GameColors, Spacing } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface AnimatedProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  showPercentage?: boolean;
  showGlow?: boolean;
  animated?: boolean;
  colors?: string[];
  backgroundColor?: string;
  label?: string;
  icon?: string;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  height = 24,
  showPercentage = true,
  showGlow = true,
  animated = true,
  colors = [GameColors.buttonSecondary, GameColors.gradientMiddle, GameColors.gradientEnd],
  backgroundColor = GameColors.backgroundLight,
  label,
  icon,
}) => {
  const animatedProgress = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withSpring(progress, {
        damping: 15,
        stiffness: 100,
      });

      // Glow effect when progress changes
      if (showGlow) {
        glowIntensity.value = withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 1000 })
        );
      }

      // Pulse effect for high progress
      if (progress > 0.8) {
        pulseScale.value = withSequence(
          withSpring(1.05, { damping: 15 }),
          withSpring(1, { damping: 15 })
        );
      }
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated, showGlow]);

  const progressStyle = useAnimatedStyle(() => {
    const widthValue = `${animatedProgress.value * 100}%`;
    return { width: widthValue as any };
  });

  const glowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(glowIntensity.value, [0, 1], [0, 0.6]);
    const glowScale = interpolate(glowIntensity.value, [0, 1], [1, 1.1]);

    return {
      opacity: glowOpacity,
      transform: [{ scale: glowScale }],
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const textColorStyle = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      animatedProgress.value,
      [0, 0.5, 1],
      [GameColors.textSecondary, GameColors.textPrimary, GameColors.buttonSuccess]
    );
    return { color: textColor };
  });

  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Animated.Text style={[styles.label, textColorStyle]}>
            {label}
          </Animated.Text>
          {showPercentage && (
            <Animated.Text style={[styles.percentage, textColorStyle]}>
              {percentage}%
            </Animated.Text>
          )}
        </View>
      )}

      {/* Progress Bar */}
      <Animated.View style={[styles.progressContainer, { height }, containerStyle]}>
        {/* Glow Effect */}
        {showGlow && (
          <Animated.View
            style={[
              styles.glow,
              {
                height: height + 8,
                backgroundColor: colors[0],
                shadowColor: colors[0],
              },
              glowStyle,
            ]}
          />
        )}

        {/* Background */}
        <View
          style={[
            styles.background,
            {
              backgroundColor,
              borderRadius: height / 2,
            },
          ]}
        />

        {/* Progress Fill */}
        <Animated.View style={[styles.progressFill, progressStyle as any]}>
          <LinearGradient
            colors={colors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.gradient,
              {
                borderRadius: height / 2,
              },
            ]}
          />

          {/* Shimmer Effect */}
          <ShimmerEffect height={height} />
        </Animated.View>

        {/* Progress Indicator Dot */}
        <ProgressDot progress={animatedProgress} height={height} color={colors[0]} />
      </Animated.View>
    </View>
  );
};

interface ShimmerEffectProps {
  height: number;
}

const ShimmerEffect: React.FC<ShimmerEffectProps> = ({ height }) => {
  const shimmerPosition = useSharedValue(-100);

  useEffect(() => {
    const startShimmer = () => {
      shimmerPosition.value = withTiming(100, { duration: 2000 }, () => {
        shimmerPosition.value = -100;
        setTimeout(startShimmer, 3000);
      });
    };

    const timer = setTimeout(startShimmer, 1000);
    return () => clearTimeout(timer);
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${shimmerPosition.value}%` }],
  }));

  return (
    <Animated.View style={[styles.shimmer, { height }, shimmerStyle]}>
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.shimmerGradient}
      />
    </Animated.View>
  );
};

interface ProgressDotProps {
  progress: SharedValue<number>;
  height: number;
  color: string;
}

const ProgressDot: React.FC<ProgressDotProps> = ({ progress, height, color }) => {
  const dotStyle = useAnimatedStyle(() => {
    const leftPosition = interpolate(progress.value, [0, 1], [0, 100]);
    const scale = interpolate(progress.value, [0, 0.1, 1], [0, 1, 1]);

    return {
      left: `${leftPosition}%`,
      transform: [{ scale }],
    };
  });

  const dotSize = height + 4;

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
          marginLeft: -dotSize / 2,
          top: -2,
        },
        dotStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: FontSizes.md,
    marginRight: Spacing.xs,
  },
  label: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  percentage: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    left: -4,
    right: -4,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressFill: {
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  gradient: {
    flex: 1,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    width: '30%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  shimmerGradient: {
    flex: 1,
  },
  dot: {
    position: 'absolute',
    shadowColor: GameColors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});