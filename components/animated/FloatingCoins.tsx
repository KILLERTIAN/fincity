import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface FloatingCoinsProps {
    show: boolean;
    amount: number;
    onComplete?: () => void;
}

export const FloatingCoins: React.FC<FloatingCoinsProps> = ({
    show,
    amount,
    onComplete,
}) => {
    const coins = Array.from({ length: Math.min(amount, 10) }, (_, i) => i);

    return (
        <View style={styles.container} pointerEvents="none">
            {show &&
                coins.map((_, index) => (
                    <FloatingCoin key={index} delay={index * 100} onComplete={index === 0 ? onComplete : undefined} />
                ))}
        </View>
    );
};

const FloatingCoin: React.FC<{ delay: number; onComplete?: () => void }> = ({
    delay,
    onComplete,
}) => {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const rotate = useSharedValue(0);

    useEffect(() => {
        const randomX = (Math.random() - 0.5) * 100;

        translateY.value = withTiming(-200, { duration: 1500 }, () => {
            if (onComplete) onComplete();
        });
        translateX.value = withSpring(randomX);
        opacity.value = withSequence(
            withTiming(1, { duration: 500 }),
            withTiming(0, { duration: 1000 })
        );
        rotate.value = withRepeat(
            withTiming(360, { duration: 1000 }),
            2,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.coin, animatedStyle]}>
            <Ionicons name="logo-usd" size={24} color="#FFB800" />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    coin: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF8E6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFB800',
    },
});
