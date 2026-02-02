import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
} from 'react-native-reanimated';

interface AvatarBounceProps {
    children: React.ReactNode;
    isActive?: boolean;
    size?: number;
}

export const AvatarBounce: React.FC<AvatarBounceProps> = ({
    children,
    isActive = false,
    size = 56,
}) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isActive) {
            scale.value = withRepeat(
                withSequence(
                    withSpring(1.1, { damping: 2, stiffness: 100 }),
                    withSpring(1, { damping: 2, stiffness: 100 })
                ),
                -1,
                true
            );
        } else {
            scale.value = withSpring(1);
        }
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
