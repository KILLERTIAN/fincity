import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export type PopupType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface PopupButton {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface CustomPopupProps {
    visible: boolean;
    onClose: () => void;
    type?: PopupType;
    title: string;
    message?: string;
    buttons?: PopupButton[];
    children?: React.ReactNode;
    showCloseButton?: boolean;
}

const POPUP_CONFIGS: Record<PopupType, { icon: string; gradient: [string, string]; color: string; bgColor: string }> = {
    success: {
        icon: 'checkmark-circle',
        gradient: ['#B8FF66', '#8EDB2E'],
        color: '#46A302',
        bgColor: '#F0FFF4',
    },
    error: {
        icon: 'close-circle',
        gradient: ['#FF8888', '#FF4B4B'],
        color: '#E53935',
        bgColor: '#FFF5F5',
    },
    warning: {
        icon: 'warning',
        gradient: ['#FFD93D', '#FFB800'],
        color: '#B88600',
        bgColor: '#FFF9E6',
    },
    info: {
        icon: 'information-circle',
        gradient: ['#54D1FF', '#1CB0F6'],
        color: '#0084C2',
        bgColor: '#F0F9FF',
    },
    confirm: {
        icon: 'help-circle',
        gradient: ['#CE82FF', '#A358DF'],
        color: '#7B1FA2',
        bgColor: '#F9F0FF',
    },
};

export const CustomPopup: React.FC<CustomPopupProps> = ({
    visible,
    onClose,
    type = 'info',
    title,
    message,
    buttons,
    children,
    showCloseButton = true,
}) => {
    const config = POPUP_CONFIGS[type];

    const handleButtonPress = (button: PopupButton) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        button.onPress();
    };

    const defaultButtons: PopupButton[] = buttons || [
        { text: 'GOT IT', onPress: onClose, style: 'default' },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={styles.overlay}
                >
                    <Pressable style={styles.backdrop} onPress={onClose} />

                    <Animated.View
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(200)}
                        style={styles.popup}
                    >
                        {/* Status Icon Decoration */}
                        <View style={styles.iconWrapper}>
                            <LinearGradient colors={config.gradient} style={styles.iconCircle}>
                                <Ionicons name={config.icon as any} size={42} color="white" />
                            </LinearGradient>
                        </View>

                        {showCloseButton && (
                            <Pressable style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={20} color="#8B8B8B" />
                            </Pressable>
                        )}

                        <View style={styles.content}>
                            <Text style={styles.title}>{title.toUpperCase()}</Text>
                            {message && <Text style={styles.message}>{message}</Text>}
                            {children}
                        </View>

                        {/* Buttons section with game-style padding */}
                        <View style={styles.buttonContainer}>
                            {defaultButtons.map((button, index) => {
                                const isCancel = button.style === 'cancel';
                                const isDestructive = button.style === 'destructive';
                                const isSuccess = type === 'success';

                                return (
                                    <Pressable
                                        key={index}
                                        style={({ pressed }) => [
                                            styles.button,
                                            isCancel && styles.cancelButton,
                                            isDestructive && styles.destructiveButton,
                                            (!isCancel && !isDestructive) && { backgroundColor: isSuccess ? '#B8FF66' : '#1F1F1F' },
                                            pressed && { transform: [{ translateY: 2 }] },
                                        ]}
                                        onPress={() => handleButtonPress(button)}
                                    >
                                        <View style={[
                                            styles.buttonInner,
                                            isCancel && { borderBottomWidth: 4, borderBottomColor: '#E0E0E0' },
                                            isDestructive && { borderBottomWidth: 4, borderBottomColor: '#CC0000' },
                                            (!isCancel && !isDestructive) && { borderBottomWidth: 4, borderBottomColor: isSuccess ? '#8ADB2E' : '#000000' },
                                        ]}>
                                            <Text
                                                style={[
                                                    styles.buttonText,
                                                    isCancel && styles.cancelButtonText,
                                                    (!isCancel && !isDestructive) && { color: isSuccess ? '#1F1F1F' : 'white' },
                                                ]}
                                            >
                                                {button.text.toUpperCase()}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </Animated.View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(31, 31, 31, 0.85)',
    },
    popup: {
        width: '100%',
        maxWidth: 420, // Increased for better web presence
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        paddingTop: 56,
        paddingBottom: 24,
        paddingHorizontal: 24,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 15,
        borderWidth: 2,
        borderColor: '#F0F0F0',
    },
    iconWrapper: {
        position: 'absolute',
        top: -45,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    content: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 28,
        letterSpacing: 1,
    },
    message: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B8B8B',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        gap: 16,
    },
    button: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    buttonInner: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
    },
    destructiveButton: {
        backgroundColor: '#FF4B4B',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1.5,
    },
    cancelButtonText: {
        color: '#8B8B8B',
    },
});

export default CustomPopup;


