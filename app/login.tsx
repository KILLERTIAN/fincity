import { useGame } from '@/contexts/game-context';
import { authApi } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

/**
 * Login screen for FinCity.
 * Provides authentication via email/password and guest login.
 */
export default function Login() {
    const router = useRouter();
    const { refreshProfile } = useGame();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await authApi.login(email, password);
            await refreshProfile(); // Refresh profile data immediately after login
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.error || 'Invalid credentials. Try admin@fincity.com / password123';
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            await authApi.guestLogin('Player');
            await refreshProfile(); // Refresh profile data immediately after guest login
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Guest login error:', error);
            Alert.alert('Error', 'Failed to start guest session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <LinearGradient
                colors={['#F0F7FF', '#FFFFFF']}
                style={styles.background}
            />

            <View style={styles.content}>
                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.header}>
                    <View style={styles.logoBox}>
                        <Ionicons name="stats-chart" size={40} color="#1CB0F6" />
                    </View>
                    <Text style={styles.title}>FinCity</Text>
                    <Text style={styles.subtitle}>Build your financial empire</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#AFAFAF" />
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>PASSWORD</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#AFAFAF" />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <Pressable onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#AFAFAF"
                                />
                            </Pressable>
                        </View>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.loginBtn,
                            { opacity: pressed || loading ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginBtnText}>SIGN IN</Text>
                        )}
                    </Pressable>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.guestBtn,
                            { opacity: pressed ? 0.8 : 1 }
                        ]}
                        onPress={handleGuestLogin}
                    >
                        <Text style={styles.guestBtnText}>Continue as Guest</Text>
                    </Pressable>
                </Animated.View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Pressable onPress={() => router.push('/onboarding')}>
                        <Text style={styles.footerLink}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoBox: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1CB0F6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1F1F1F',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8B8B8B',
        marginTop: 4,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#8B8B8B',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        borderWidth: 2,
        borderColor: '#F0F0F0',
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1F1F1F',
        marginLeft: 12,
    },
    loginBtn: {
        backgroundColor: '#1CB0F6',
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        shadowColor: '#1CB0F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    loginBtnText: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 1,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    dividerText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#AFAFAF',
        marginHorizontal: 16,
    },
    guestBtn: {
        alignItems: 'center',
        padding: 12,
    },
    guestBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1CB0F6',
    },
});
