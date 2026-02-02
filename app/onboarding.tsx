import { BorderRadius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ONBOARDING_STEPS = [
    {
        id: 1,
        title: "Hi! I'm Penny! 👋",
        message: "I'm your money buddy! Together, we'll learn how to save, earn, and have fun with friends!",
        mascotMessage: "Let's start with your name!",
        inputPlaceholder: "What's your name?",
        buttonText: "Nice to meet you!",
    },
    {
        id: 2,
        title: "Choose Your Avatar! 🎨",
        message: "Pick a cool avatar that represents you in the game!",
        mascotMessage: "This is how your friends will see you!",
        buttonText: "Let's Go!",
    },
    {
        id: 3,
        title: "Ready to Play! 🚀",
        message: "Complete daily quests, help friends, and level up to become a Money Master!",
        mascotMessage: "I'll be here to guide you every step of the way!",
        buttonText: "Start Adventure!",
    },
];

const AVATAR_OPTIONS = ['😎', '🤓', '😺', '🦊', '🐼', '🦁', '🐯', '🐸'];

export default function OnboardingScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const [userName, setUserName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('😎');
    const mascotRef = useRef<LottieView>(null);
    const cloudScale = useSharedValue(1);

    const step = ONBOARDING_STEPS[currentStep];

    const handleNext = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        mascotRef.current?.play();

        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Save user data and navigate to main app
            router.replace('/(tabs)');
        }
    };

    const handleAvatarSelect = (avatar: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedAvatar(avatar);
        mascotRef.current?.play();
    };

    const cloudAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cloudScale.value }],
    }));

    React.useEffect(() => {
        cloudScale.value = withSequence(
            withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        );
        const interval = setInterval(() => {
            cloudScale.value = withSequence(
                withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            );
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar style="light" />

            {/* Sky Gradient Background */}
            <LinearGradient
                colors={['#87CEEB', '#B0E0E6', '#E0F6FF']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            {/* Floating Clouds */}
            <Animated.View style={[styles.cloud, styles.cloud1, cloudAnimatedStyle]}>
                <Text style={styles.cloudText}>☁️</Text>
            </Animated.View>
            <Animated.View style={[styles.cloud, styles.cloud2, cloudAnimatedStyle]}>
                <Text style={styles.cloudText}>☁️</Text>
            </Animated.View>
            <Animated.View style={[styles.cloud, styles.cloud3, cloudAnimatedStyle]}>
                <Text style={styles.cloudText}>☁️</Text>
            </Animated.View>

            {/* Progress Dots */}
            <View style={styles.progressContainer}>
                {ONBOARDING_STEPS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progressDot,
                            index === currentStep && styles.progressDotActive,
                        ]}
                    />
                ))}
            </View>

            {/* Mascot Animation */}
            <View style={styles.mascotContainer}>
                <LottieView
                    ref={mascotRef}
                    source={require('@/assets/animations/Yay Jump Animation.json')}
                    style={styles.mascot}
                    autoPlay
                    loop
                />
            </View>

            {/* Speech Bubble */}
            <View style={styles.speechBubble}>
                <View style={styles.speechBubbleTriangle} />
                <Text style={styles.mascotText}>{step.mascotMessage}</Text>
            </View>

            {/* Content Card */}
            <View style={styles.contentCard}>
                <Text style={styles.title}>{step.title}</Text>
                <Text style={styles.message}>{step.message}</Text>

                {/* Step 1: Name Input */}
                {currentStep === 0 && (
                    <View style={styles.inputContainer}>
                        <Ionicons name="person" size={24} color="#1CB0F6" />
                        <TextInput
                            style={styles.input}
                            placeholder={step.inputPlaceholder}
                            placeholderTextColor="#999"
                            value={userName}
                            onChangeText={setUserName}
                            autoFocus
                        />
                    </View>
                )}

                {/* Step 2: Avatar Selection */}
                {currentStep === 1 && (
                    <View style={styles.avatarGrid}>
                        {AVATAR_OPTIONS.map((avatar) => (
                            <Pressable
                                key={avatar}
                                style={[
                                    styles.avatarOption,
                                    selectedAvatar === avatar && styles.avatarOptionSelected,
                                ]}
                                onPress={() => handleAvatarSelect(avatar)}
                            >
                                <Text style={styles.avatarEmoji}>{avatar}</Text>
                                {selectedAvatar === avatar && (
                                    <View style={styles.checkmark}>
                                        <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </View>
                )}

                {/* Step 3: Features Preview */}
                {currentStep === 2 && (
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: '#FFD700' }]}>
                                <Ionicons name="trophy" size={28} color="white" />
                            </View>
                            <Text style={styles.featureText}>Complete Quests</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: '#1CB0F6' }]}>
                                <Ionicons name="people" size={28} color="white" />
                            </View>
                            <Text style={styles.featureText}>Help Friends</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: '#58CC02' }]}>
                                <Ionicons name="rocket" size={28} color="white" />
                            </View>
                            <Text style={styles.featureText}>Level Up</Text>
                        </View>
                    </View>
                )}

                {/* Next Button */}
                <Pressable
                    style={[
                        styles.nextButton,
                        (currentStep === 0 && !userName) && styles.nextButtonDisabled,
                    ]}
                    onPress={handleNext}
                    disabled={currentStep === 0 && !userName}
                >
                    <Text style={styles.nextButtonText}>{step.buttonText}</Text>
                    <Ionicons name="arrow-forward" size={24} color="white" />
                </Pressable>
            </View>

            {/* Skip Button */}
            {currentStep < ONBOARDING_STEPS.length - 1 && (
                <Pressable
                    style={styles.skipButton}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </Pressable>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    cloud: {
        position: 'absolute',
    },
    cloud1: {
        top: 100,
        left: 20,
    },
    cloud2: {
        top: 150,
        right: 30,
    },
    cloud3: {
        top: 250,
        left: width / 2 - 30,
    },
    cloudText: {
        fontSize: 60,
        opacity: 0.8,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.xl,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    progressDotActive: {
        backgroundColor: 'white',
        width: 30,
    },
    mascotContainer: {
        alignItems: 'center',
        marginTop: Spacing.xxl,
    },
    mascot: {
        width: 200,
        height: 200,
    },
    speechBubble: {
        backgroundColor: 'white',
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginHorizontal: Spacing.xl,
        marginTop: Spacing.lg,
        position: 'relative',
        borderWidth: 3,
        borderColor: '#1CB0F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    speechBubbleTriangle: {
        position: 'absolute',
        top: -15,
        left: width / 2 - 15,
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 15,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#1CB0F6',
    },
    mascotText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1CB0F6',
        textAlign: 'center',
    },
    contentCard: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        marginTop: Spacing.xxl,
        padding: Spacing.xxl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    message: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: Spacing.xxl,
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        marginBottom: Spacing.xxl,
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#1F1F1F',
        marginLeft: Spacing.md,
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.xxl,
    },
    avatarOption: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#E5E5E5',
        position: 'relative',
    },
    avatarOptionSelected: {
        borderColor: '#58CC02',
        backgroundColor: '#E8F5E9',
    },
    avatarEmoji: {
        fontSize: 36,
    },
    checkmark: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    featuresContainer: {
        gap: Spacing.lg,
        marginBottom: Spacing.xxl,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        gap: Spacing.md,
    },
    featureIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    nextButton: {
        flexDirection: 'row',
        backgroundColor: '#58CC02',
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        borderWidth: 3,
        borderColor: '#46A302',
        borderBottomWidth: 6,
    },
    nextButtonDisabled: {
        backgroundColor: '#CCC',
        borderColor: '#AAA',
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
    },
    skipButton: {
        position: 'absolute',
        top: Spacing.xl,
        right: Spacing.xl,
        padding: Spacing.md,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
});
