import { BorderRadius, FontSizes, GameColors, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface GameCardProps {
  children: React.ReactNode;
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
  glowColor?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GameCard: React.FC<GameCardProps> = ({
  children,
  title,
  onPress,
  style,
  animated = true,
  glowColor = GameColors.buttonPrimary,
}) => {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const handlePressIn = () => {
    if (animated) {
      scale.value = withSpring(0.95, { damping: 15 });
      shadowOpacity.value = withTiming(0.2, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (animated) {
      scale.value = withSpring(1, { damping: 15 });
      shadowOpacity.value = withTiming(0.1, { duration: 150 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animated ? scale.value : 1 }],
  }));

  const cardContent = (
    <View style={styles.cardContent}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}
      {children}
    </View>
  );

  return (
    <AnimatedPressable
      style={[
        styles.card,
        { borderColor: GameColors.border },
        style,
        animatedStyle
      ]}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      onPress={onPress}
      disabled={!onPress}
    >
      {cardContent}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: GameColors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    borderWidth: 2,
    borderBottomWidth: 4,
    shadowColor: GameColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardContent: {
    width: '100%',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: GameColors.text,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
});