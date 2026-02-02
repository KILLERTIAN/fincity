import { BorderRadius, FontSizes, GameColors, Spacing } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface FloatingActionItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface FloatingActionMenuProps {
  items: FloatingActionItem[];
  mainIcon?: string;
  mainColor?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  items,
  mainIcon = '💰',
  mainColor = GameColors.buttonPrimary,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    rotation.value = withSpring(newState ? 45 : 0, { damping: 15 });
    scale.value = withSpring(newState ? 1.1 : 1, { damping: 15 });
  };

  const mainButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Action Items */}
      {items.map((item, index) => (
        <FloatingActionItem
          key={item.id}
          item={item}
          index={index}
          isOpen={isOpen}
          totalItems={items.length}
        />
      ))}

      {/* Main Button */}
      <AnimatedPressable
        style={[styles.mainButton, mainButtonStyle]}
        onPress={toggleMenu}
      >
        <LinearGradient
          colors={[mainColor, GameColors.gradientMiddle]}
          style={styles.mainButtonGradient}
        >
          <Text style={styles.mainButtonIcon}>{mainIcon}</Text>
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
};

interface FloatingActionItemProps {
  item: FloatingActionItem;
  index: number;
  isOpen: boolean;
  totalItems: number;
}

const FloatingActionItem: React.FC<FloatingActionItemProps> = ({
  item,
  index,
  isOpen,
  totalItems,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  React.useEffect(() => {
    const delay = index * 100;
    const angle = (index * 60) - 30; // Spread items in an arc
    const distance = 80;

    if (isOpen) {
      translateY.value = withDelay(
        delay,
        withSpring(-distance * Math.cos((angle * Math.PI) / 180), { damping: 15 })
      );
      translateX.value = withDelay(
        delay,
        withSpring(distance * Math.sin((angle * Math.PI) / 180), { damping: 15 })
      );
      opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
      scale.value = withDelay(delay, withSpring(1, { damping: 15 }));
    } else {
      translateY.value = withTiming(0, { duration: 200 });
      translateX.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    item.onPress();
  };

  return (
    <AnimatedPressable
      style={[styles.actionItem, animatedStyle]}
      onPress={handlePress}
    >
      <LinearGradient
        colors={[item.color, GameColors.gradientEnd]}
        style={styles.actionItemGradient}
      >
        <Text style={styles.actionItemIcon}>{item.icon}</Text>
      </LinearGradient>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{item.title}</Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: GameColors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mainButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonIcon: {
    fontSize: 24,
  },
  actionItem: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: GameColors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionItemGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionItemIcon: {
    fontSize: 20,
  },
  labelContainer: {
    position: 'absolute',
    right: 60,
    backgroundColor: GameColors.textPrimary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    shadowColor: GameColors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  labelText: {
    fontSize: FontSizes.xs,
    color: GameColors.textWhite,
    fontWeight: '600',
  },
});