import React, { useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    style?: any;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 1000,
    prefix = '',
    suffix = '',
    decimals = 2,
    style,
}) => {
    const animatedValue = useSharedValue(0);

    useEffect(() => {
        animatedValue.value = withTiming(value, {
            duration,
            easing: Easing.out(Easing.cubic),
        });
    }, [value]);

    const animatedProps = useAnimatedProps(() => {
        const displayValue = animatedValue.value.toFixed(decimals);
        return {
            text: `${prefix}${displayValue}${suffix}`,
        } as any;
    });

    return (
        <AnimatedTextInput
            editable={false}
            value={`${prefix}${value.toFixed(decimals)}${suffix}`}
            style={[styles.text, style]}
            animatedProps={animatedProps}
        />
    );
};

const styles = StyleSheet.create({
    text: {
        fontWeight: '900',
        color: '#1F1F1F',
    },
});
