import { BorderRadius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface XPProgressBarProps {
    currentXP: number;
    requiredXP: number;
    level: number;
    showLevel?: boolean;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
    currentXP,
    requiredXP,
    level,
    showLevel = true,
}) => {
    const progress = useSharedValue(0);
    const progressPercentage = Math.min((currentXP / requiredXP) * 100, 100);

    useEffect(() => {
        progress.value = withTiming(progressPercentage, {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
        });
    }, [progressPercentage]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    return (
        <View style={styles.container}>
            {showLevel && (
                <View style={styles.levelBadge}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.levelText}>LV {level}</Text>
                </View>
            )}

            <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                    <Animated.View style={[styles.progressBar, animatedStyle]}>
                        <View style={styles.shine} />
                    </Animated.View>
                </View>
                <Text style={styles.xpText}>
                    {currentXP} / {requiredXP} XP
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#1F1F1F',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        gap: 4,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFD700',
        letterSpacing: 1,
    },
    progressContainer: {
        width: '100%',
    },
    progressBackground: {
        height: 24,
        backgroundColor: '#E5E5E5',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#D0D0D0',
        marginBottom: Spacing.xs,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    shine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    xpText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#8B8B8B',
        textAlign: 'center',
    },
});
