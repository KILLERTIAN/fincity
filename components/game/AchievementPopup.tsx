import { BorderRadius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    reward?: {
        type: 'coins' | 'xp' | 'item';
        amount: number;
    };
}

interface AchievementPopupProps {
    visible: boolean;
    achievement: Achievement | null;
    onClose: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
    visible,
    achievement,
    onClose,
}) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const confettiRef = useRef<LottieView>(null);

    useEffect(() => {
        if (visible && achievement) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Trigger confetti animation
            confettiRef.current?.play();

            // Animate popup entrance
            scale.value = withSequence(
                withSpring(1.2, { damping: 8 }),
                withSpring(1, { damping: 12 })
            );
            opacity.value = withTiming(1, { duration: 300 });

            // Auto-close after 3 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            scale.value = withTiming(0, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 });
        }
    }, [visible, achievement]);

    const handleClose = () => {
        scale.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 });
        setTimeout(onClose, 250);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    if (!achievement) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <Pressable style={styles.overlay} onPress={handleClose}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    {/* Confetti Animation */}
                    <LottieView
                        ref={confettiRef}
                        source={require('@/assets/animations/confetti.json')}
                        style={styles.confetti}
                        loop={false}
                        autoPlay={false}
                    />

                    {/* Achievement Badge */}
                    <View style={[styles.badge, { backgroundColor: achievement.color }]}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={achievement.icon as any}
                                size={64}
                                color="white"
                            />
                        </View>
                        <View style={styles.shine} />
                    </View>

                    {/* Achievement Text */}
                    <View style={styles.content}>
                        <Text style={styles.label}>ACHIEVEMENT UNLOCKED!</Text>
                        <Text style={styles.title}>{achievement.title}</Text>
                        <Text style={styles.description}>{achievement.description}</Text>

                        {/* Reward Display */}
                        {achievement.reward && (
                            <View style={styles.reward}>
                                <View style={styles.rewardBadge}>
                                    <Text style={styles.rewardIcon}>
                                        {achievement.reward.type === 'coins' ? '💰' :
                                            achievement.reward.type === 'xp' ? '⭐' : '🎁'}
                                    </Text>
                                    <Text style={styles.rewardText}>
                                        +{achievement.reward.amount} {achievement.reward.type.toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Close Button */}
                    <Pressable style={styles.closeButton} onPress={handleClose}>
                        <Text style={styles.closeText}>Awesome!</Text>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: BorderRadius.xxl,
        padding: Spacing.xxl,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 20,
    },
    confetti: {
        position: 'absolute',
        width: width,
        height: height,
        top: -height / 2,
        left: -width * 0.425,
        zIndex: 10,
    },
    badge: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        borderWidth: 6,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden',
    },
    iconContainer: {
        zIndex: 2,
    },
    shine: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 100,
        height: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        transform: [{ rotate: '45deg' }],
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    label: {
        fontSize: 12,
        fontWeight: '900',
        color: '#FFD700',
        letterSpacing: 2,
        marginBottom: Spacing.sm,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    description: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    reward: {
        width: '100%',
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E6',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: '#FFD700',
        gap: Spacing.sm,
    },
    rewardIcon: {
        fontSize: 24,
    },
    rewardText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#8B6914',
    },
    closeButton: {
        marginTop: Spacing.xl,
        backgroundColor: '#58CC02',
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: '#46A302',
        borderBottomWidth: 4,
    },
    closeText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
});
