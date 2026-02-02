import { BorderRadius, FontSizes, GameColors, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface FriendCardProps {
  name: string;
  isOnline: boolean;
  avatar?: string;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FriendCard: React.FC<FriendCardProps> = ({
  name,
  isOnline,
  avatar,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: GameColors.buttonSecondary }]}>
          <Text style={styles.avatarText}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: isOnline ? GameColors.online : GameColors.offline }
        ]} />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={[
          styles.status,
          { color: isOnline ? GameColors.online : GameColors.offline }
        ]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GameColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    shadowColor: GameColors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: GameColors.textWhite,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: GameColors.cardBackground,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: GameColors.textPrimary,
    marginBottom: 2,
  },
  status: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
});