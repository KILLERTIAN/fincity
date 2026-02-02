import { BorderRadius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
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
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface PennyHelperProps {
    visible: boolean;
    message: string;
    title?: string;
    onClose: () => void;
    actionButton?: {
        text: string;
        onPress: () => void;
    };
}

export const PennyHelper: React.FC<PennyHelperProps> = ({
    visible,
    message,
    title = "Penny says...",
    onClose,
    actionButton,
}) => {
    const mascotRef = useRef<LottieView>(null);
    const scale = useSharedValue(0);

    React.useEffect(() => {
        if (visible) {
            mascotRef.current?.play();
            scale.value = withSequence(
                withSpring(1.1, { damping: 8 }),
                withSpring(1, { damping: 12 })
            );
        } else {
            scale.value = withSpring(0);
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    {/* Mascot */}
                    <View style={styles.mascotContainer}>
                        <LottieView
                            ref={mascotRef}
                            source={require('@/assets/animations/Yay Jump Animation.json')}
                            style={styles.mascot}
                            loop
                        />
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>

                        {/* Buttons */}
                        <View style={styles.buttons}>
                            {actionButton && (
                                <Pressable
                                    style={[styles.button, styles.actionButton]}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        actionButton.onPress();
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>{actionButton.text}</Text>
                                </Pressable>
                            )}
                            <Pressable
                                style={[styles.button, styles.closeButton]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    onClose();
                                }}
                            >
                                <Text style={styles.closeButtonText}>Got it!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

// Floating Penny Button - appears in corner for quick help
interface FloatingPennyProps {
    onPress: () => void;
}

export const FloatingPenny: React.FC<FloatingPennyProps> = ({ onPress }) => {
    const bounce = useSharedValue(1);

    React.useEffect(() => {
        const interval = setInterval(() => {
            bounce.value = withSequence(
                withSpring(1.2, { damping: 8 }),
                withSpring(1, { damping: 12 })
            );
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bounce.value }],
    }));

    return (
        <Animated.View style={[styles.floatingButton, animatedStyle]}>
            <Pressable
                style={styles.floatingButtonInner}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onPress();
                }}
            >
                <LottieView
                    source={require('@/assets/animations/Yay Jump Animation.json')}
                    style={styles.floatingMascot}
                    autoPlay
                    loop
                />
                <View style={styles.helpBadge}>
                    <Ionicons name="help" size={16} color="white" />
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.9,
        backgroundColor: 'white',
        borderRadius: BorderRadius.xxl,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#1CB0F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 16,
    },
    mascotContainer: {
        backgroundColor: '#E0F6FF',
        alignItems: 'center',
        paddingTop: Spacing.lg,
    },
    mascot: {
        width: 150,
        height: 150,
    },
    content: {
        padding: Spacing.xxl,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1CB0F6',
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    message: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: Spacing.xl,
    },
    buttons: {
        gap: Spacing.md,
    },
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        borderWidth: 3,
        borderBottomWidth: 5,
    },
    actionButton: {
        backgroundColor: '#58CC02',
        borderColor: '#46A302',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    closeButton: {
        backgroundColor: '#1CB0F6',
        borderColor: '#1899D6',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 1000,
    },
    floatingButtonInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        borderWidth: 4,
        borderColor: '#1CB0F6',
        borderBottomWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    floatingMascot: {
        width: '100%',
        height: '100%',
    },
    helpBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF6B35',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
});
