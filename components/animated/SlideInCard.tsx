import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface SlideInCardProps {
    children: React.ReactNode;
    delay?: number;
    style?: any;
}

export const SlideInCard: React.FC<SlideInCardProps> = ({
    children,
    delay = 0,
    style,
}) => {
    const translateY = useSharedValue(50);
    const opacity = useSharedValue(0);

    useEffect(() => {
        setTimeout(() => {
            translateY.value = withSpring(0, {
                damping: 15,
                stiffness: 100,
            });
            opacity.value = withTiming(1, {
                duration: 400,
                easing: Easing.out(Easing.cubic),
            });
        }, delay);
    }, [delay]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});
