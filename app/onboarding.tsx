import { useGame } from '@/contexts/game-context';
import { authApi } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Onboarding slides data
const ONBOARDING_SLIDES = [
    {
        id: 0,
        title: "Welcome to FinCity! ",
        subtitle: "Your Financial Adventure Begins",
        message: "Learn to save, invest, and grow your money while having fun with friends!",
        icon: "rocket",
        colors: ['#1CB0F6', '#1286C4'] as const,
    },
    {
        id: 1,
        title: "Build Your City",
        subtitle: "Watch It Grow",
        message: "Your financial decisions help build your virtual city. Save more, unlock more buildings!",
        icon: "business",
        colors: ['#58CC02', '#46A302'] as const,
    },
    {
        id: 2,
        title: "Learn & Earn",
        subtitle: "Knowledge is Power",
        message: "Complete quizzes, watch videos, and master money skills to level up!",
        icon: "school",
        colors: ['#FFB800', '#E6A600'] as const,
    },
];

const AVATAR_OPTIONS = [
    { seed: 'boy2', bg: '#FBD4A3' },
    { seed: 'girl1', bg: '#FFD1DC' },
    { seed: 'man3', bg: '#C0E8FF' },
    { seed: 'woman4', bg: '#E0FFC0' },
    { seed: 'adventurer1', bg: '#FFEBA0' },
    { seed: 'pixel1', bg: '#D1FFD1' },
    { seed: 'bot2', bg: '#E5E5E5' },
    { seed: 'cat1', bg: '#FFF0D1' },
];

const AGE_OPTIONS = ['8-10', '11-13', '14-16', '17-18', '18+'];

export default function OnboardingScreen() {
    const { refreshProfile } = useGame();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showSlides, setShowSlides] = useState(true);
    const [setupStep, setSetupStep] = useState(0); // 0: choice, 1: auth, 2: name, 3: age, 4: avatar, 5: ready
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'guest'>('signup');

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userAge, setUserAge] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('boy2');
    const [loading, setLoading] = useState(false);

    const mascotRef = useRef<LottieView>(null);
    const cloudScale = useSharedValue(1);
    const floatY = useSharedValue(0);

    // Float animation
    React.useEffect(() => {
        floatY.value = withRepeat(
            withSequence(
                withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const floatStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: floatY.value }],
    }));

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

    const handleSlideNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (currentSlide < ONBOARDING_SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            setShowSlides(false);
        }
    };

    const handleChoice = (mode: 'login' | 'signup' | 'guest') => {
        setAuthMode(mode);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (mode === 'login' || mode === 'signup') {
            setSetupStep(1);
        } else {
            setSetupStep(2); // Jump to name for guest
        }
    };

    const handleSetupNext = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        mascotRef.current?.play();

        if (setupStep === 1) {
            // Handle Auth
            if (authMode === 'login') {
                try {
                    setLoading(true);
                    await authApi.login(email, password);
                    await refreshProfile(); // Refresh profile data
                    await AsyncStorage.setItem('onboardingComplete', 'true');
                    router.replace('/(tabs)');
                    return;
                } catch (err: any) {
                    Alert.alert('Login Failed', err.response?.data?.error || 'Check your credentials');
                } finally {
                    setLoading(false);
                }
                return;
            }
            // If signup, just go to next step (collecting name/age)
            setSetupStep(2);
        } else if (setupStep < 5) {
            setSetupStep(setupStep + 1);
        } else {
            // Final Step: Execute Signup or Guest Login
            try {
                setLoading(true);
                if (authMode === 'signup') {
                    await authApi.register(userName, email, password, selectedAvatar);
                } else if (authMode === 'guest') {
                    await authApi.guestLogin(userName, selectedAvatar);
                }

                await AsyncStorage.setItem('userName', userName);
                await AsyncStorage.setItem('userAge', userAge);
                await AsyncStorage.setItem('userAvatar', selectedAvatar);
                await AsyncStorage.setItem('onboardingComplete', 'true');
                await refreshProfile(); // Refresh profile data
                router.replace('/(tabs)');
            } catch (err: any) {
                Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAvatarSelect = (seed: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedAvatar(seed);
    };

    const handleAgeSelect = (age: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setUserAge(age);
    };

    const slide = ONBOARDING_SLIDES[currentSlide];

    // Slides View
    if (showSlides) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />

                <LinearGradient
                    colors={slide.colors}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                <SafeAreaView style={styles.safeArea}>
                    <Pressable
                        style={styles.skipBtn}
                        onPress={() => setShowSlides(false)}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </Pressable>

                    <View style={styles.progressDots}>
                        {ONBOARDING_SLIDES.map((_, idx) => (
                            <View key={idx} style={[styles.dot, idx === currentSlide && styles.dotActive]} />
                        ))}
                    </View>

                    <Animated.View style={[styles.iconContainer, floatStyle]} key={slide.id}>
                        <View style={styles.iconCircle}>
                            <Ionicons name={slide.icon as any} size={80} color="white" />
                        </View>
                    </Animated.View>

                    <View style={styles.slideContent}>
                        <Text style={styles.slideTitle}>{slide.title}</Text>
                        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
                        <Text style={styles.slideMessage}>{slide.message}</Text>
                    </View>

                    <Pressable style={styles.nextBtn} onPress={handleSlideNext}>
                        <Text style={styles.nextBtnText}>
                            {currentSlide < ONBOARDING_SLIDES.length - 1 ? 'Next' : 'Get Started'}
                        </Text>
                        <Ionicons name="arrow-forward" size={24} color="#1F1F1F" />
                    </Pressable>
                </SafeAreaView>
            </View>
        );
    }

    // Setup View
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar style="dark" />

            <LinearGradient
                colors={['#EBF5FF', '#F8FBFF', '#FFFFFF']}
                style={styles.gradient}
            />

            {/* Floating Clouds */}
            <Animated.View style={[styles.cloud, styles.cloud1, cloudAnimatedStyle]}>
                <Text style={styles.cloudText}>☁️</Text>
            </Animated.View>

            {/* Mascot */}
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
                <Text style={styles.mascotText}>
                    {setupStep === 0 && "Welcome! Ready to join FinCity?"}
                    {setupStep === 1 && (authMode === 'login' ? "Welcome back! Enter your details." : "Great! Let's set up your account.")}
                    {setupStep === 2 && "Awesome! What should we call you?"}
                    {setupStep === 3 && `Cool name, ${userName}! How old are you?`}
                    {setupStep === 4 && "Pick an avatar that looks like you!"}
                    {setupStep === 5 && `Whooosh! You're ready to roll, ${userName}!`}
                </Text>
            </View>

            <KeyboardAvoidingView
                style={styles.contentCard}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    {/* Step 0: Choice */}
                    {setupStep === 0 && (
                        <Animated.View entering={FadeIn.duration(400)}>
                            <Text style={styles.setupTitle}>Join the Adventure</Text>
                            <Pressable style={styles.choiceBtnSignup} onPress={() => handleChoice('signup')}>
                                <Ionicons name="person-add" size={24} color="white" />
                                <Text style={styles.choiceBtnTextWhite}>Create New Account</Text>
                            </Pressable>
                            <Pressable style={styles.choiceBtnLogin} onPress={() => handleChoice('login')}>
                                <Ionicons name="log-in" size={24} color="#1CB0F6" />
                                <Text style={styles.choiceBtnTextBlue}>I already have one</Text>
                            </Pressable>
                            <Pressable style={styles.choiceBtnGuest} onPress={() => handleChoice('guest')}>
                                <Text style={styles.choiceBtnTextGray}>Play as Guest</Text>
                            </Pressable>
                        </Animated.View>
                    )}

                    {/* Step 1: Auth Form */}
                    {setupStep === 1 && (
                        <Animated.View entering={FadeIn.duration(400)}>
                            <Text style={styles.setupTitle}>{authMode === 'login' ? 'Welcome Back' : 'Sign Up'}</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail" size={20} color="#1CB0F6" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed" size={20} color="#1CB0F6" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </Animated.View>
                    )}

                    {/* Step 2: Name Input */}
                    {setupStep === 2 && (
                        <Animated.View entering={FadeIn.duration(400)}>
                            <Text style={styles.setupTitle}>Your Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person" size={20} color="#1CB0F6" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    value={userName}
                                    onChangeText={setUserName}
                                    autoFocus
                                    maxLength={20}
                                />
                            </View>
                        </Animated.View>
                    )}

                    {/* Step 3: Age */}
                    {setupStep === 3 && (
                        <Animated.View entering={FadeIn.duration(400)}>
                            <Text style={styles.setupTitle}>Your Age</Text>
                            <View style={styles.ageGrid}>
                                {AGE_OPTIONS.map((age) => (
                                    <Pressable
                                        key={age}
                                        style={[styles.ageOption, userAge === age && styles.ageOptionSelected]}
                                        onPress={() => handleAgeSelect(age)}
                                    >
                                        <Text style={[styles.ageText, userAge === age && styles.ageTextSelected]}>{age}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* Step 4: Avatar Selection */}
                    {setupStep === 4 && (
                        <Animated.View entering={FadeIn.duration(400)}>
                            <Text style={styles.setupTitle}>Pick Avatar</Text>
                            <View style={styles.avatarGrid}>
                                {AVATAR_OPTIONS.map((item) => (
                                    <Pressable
                                        key={item.seed}
                                        style={[
                                            styles.avatarOption,
                                            { backgroundColor: item.bg },
                                            selectedAvatar === item.seed && styles.avatarOptionSelected,
                                        ]}
                                        onPress={() => handleAvatarSelect(item.seed)}
                                    >
                                        <Image
                                            source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${item.seed}&backgroundColor=${item.bg.replace('#', '')}` }}
                                            style={styles.avatarImgSmall}
                                        />
                                        {selectedAvatar === item.seed && (
                                            <View style={styles.checkmark}>
                                                <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
                                            </View>
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* Step 5: Summary */}
                    {setupStep === 5 && (
                        <Animated.View entering={FadeIn.duration(400)}>
                            <View style={styles.summaryCard}>
                                <View style={styles.bigAvatar}>
                                    <Image
                                        source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${selectedAvatar}&backgroundColor=${AVATAR_OPTIONS.find(a => a.seed === selectedAvatar)?.bg.replace('#', '')}` }}
                                        style={styles.bigAvatarImg}
                                    />
                                </View>
                                <Text style={styles.summaryName}>{userName}</Text>
                                <Text style={styles.summaryAge}>Age: {userAge}</Text>
                            </View>
                        </Animated.View>
                    )}

                    {/* Action Button */}
                    {setupStep > 0 && (
                        <Pressable
                            style={[
                                styles.setupNextBtn,
                                ((setupStep === 1 && (!email || !password)) ||
                                    (setupStep === 2 && !userName) ||
                                    (setupStep === 3 && !userAge)) && styles.nextButtonDisabled,
                            ]}
                            onPress={handleSetupNext}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.setupNextBtnText}>
                                        {setupStep === 5 ? "Start Adventure!" :
                                            setupStep === 1 && authMode === 'login' ? "Sign In" : "Continue"}
                                    </Text>
                                    <Ionicons name="arrow-forward" size={24} color="white" />
                                </>
                            )}
                        </Pressable>
                    )}

                    {setupStep > 1 && (
                        <Pressable style={styles.backLink} onPress={() => setSetupStep(setupStep - 1)}>
                            <Text style={styles.backLinkText}>Go Back</Text>
                        </Pressable>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 24,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    skipBtn: {
        alignSelf: 'flex-end',
        padding: 12,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
    },
    progressDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        width: 32,
        backgroundColor: 'white',
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    slideContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    slideTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    slideSubtitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 16,
    },
    slideMessage: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 24,
    },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 18,
        borderRadius: 24,
        gap: 10,
        marginBottom: 40,
    },
    nextBtnText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    cloud: { position: 'absolute' },
    cloud1: { top: 60, left: 20 },
    cloudText: { fontSize: 50, opacity: 0.5 },
    mascotContainer: { alignItems: 'center', marginTop: -10 },
    mascot: { width: 140, height: 140 },
    speechBubble: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginHorizontal: 32,
        marginTop: 10,
        borderWidth: 3,
        borderColor: '#1CB0F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    speechBubbleTriangle: {
        position: 'absolute',
        top: -15,
        left: '50%',
        marginLeft: -15,
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
        fontWeight: '800',
        color: '#1CB0F6',
        textAlign: 'center',
    },
    contentCard: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 10,
    },
    setupTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
        marginBottom: 24,
    },
    choiceBtnSignup: {
        flexDirection: 'row',
        backgroundColor: '#1CB0F6',
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 12,
    },
    choiceBtnLogin: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 2,
        borderColor: '#1CB0F6',
        marginBottom: 12,
    },
    choiceBtnGuest: {
        padding: 18,
        alignItems: 'center',
    },
    choiceBtnTextWhite: { fontSize: 18, fontWeight: '900', color: 'white' },
    choiceBtnTextBlue: { fontSize: 18, fontWeight: '900', color: '#1CB0F6' },
    choiceBtnTextGray: { fontSize: 16, fontWeight: '700', color: '#8B8B8B' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    input: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1F1F1F', marginLeft: 12 },
    ageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
    ageOption: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    ageOptionSelected: { borderColor: '#58CC02', backgroundColor: '#E8F5E9' },
    ageText: { fontSize: 16, fontWeight: '800', color: '#1F1F1F' },
    ageTextSelected: { color: '#46A302' },
    avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center' },
    avatarOption: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    avatarOptionSelected: { borderWidth: 4, borderColor: '#58CC02' },
    avatarImgSmall: { width: '85%', height: '85%', borderRadius: 30 },
    checkmark: { position: 'absolute', bottom: -5, right: -5, backgroundColor: 'white', borderRadius: 12 },
    summaryCard: { alignItems: 'center', padding: 20, backgroundColor: '#F8F8F8', borderRadius: 24, marginBottom: 20 },
    bigAvatar: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', borderWidth: 4, borderColor: 'white', marginBottom: 16 },
    bigAvatarImg: { width: '100%', height: '100%' },
    summaryName: { fontSize: 24, fontWeight: '900', color: '#1F1F1F' },
    summaryAge: { fontSize: 16, fontWeight: '600', color: '#8B8B8B' },
    setupNextBtn: {
        flexDirection: 'row',
        backgroundColor: '#58CC02',
        borderRadius: 24,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderBottomWidth: 6,
        borderColor: '#46A302',
        marginTop: 20,
    },
    nextButtonDisabled: { opacity: 0.5 },
    setupNextBtnText: { fontSize: 18, fontWeight: '900', color: 'white', letterSpacing: 1 },
    backLink: { padding: 15, alignItems: 'center' },
    backLinkText: { color: '#8B8B8B', fontWeight: '700' },
});
