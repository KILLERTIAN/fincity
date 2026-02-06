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
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

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

const POPUP_CONFIGS: Record<PopupType, { icon: string; gradient: [string, string]; iconColor: string }> = {
    success: {
        icon: 'checkmark-circle',
        gradient: ['#58CC02', '#46A501'],
        iconColor: '#FFFFFF',
    },
    error: {
        icon: 'close-circle',
        gradient: ['#FF4B4B', '#E53935'],
        iconColor: '#FFFFFF',
    },
    warning: {
        icon: 'warning',
        gradient: ['#FF9800', '#F57C00'],
        iconColor: '#FFFFFF',
    },
    info: {
        icon: 'information-circle',
        gradient: ['#1CB0F6', '#1E90FF'],
        iconColor: '#FFFFFF',
    },
    confirm: {
        icon: 'help-circle',
        gradient: ['#9C27B0', '#7B1FA2'],
        iconColor: '#FFFFFF',
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        button.onPress();
    };

    const defaultButtons: PopupButton[] = buttons || [
        { text: 'OK', onPress: onClose, style: 'default' },
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
                        entering={SlideInDown.springify().damping(20).stiffness(200)}
                        exiting={SlideOutDown.duration(200)}
                        style={styles.popup}
                    >
                        {/* Header */}
                        <LinearGradient colors={config.gradient} style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Ionicons name={config.icon as any} size={32} color={config.iconColor} />
                            </View>
                            <Text style={styles.title}>{title}</Text>
                            {showCloseButton && (
                                <Pressable style={styles.closeButton} onPress={onClose}>
                                    <Ionicons name="close" size={24} color="rgba(255,255,255,0.8)" />
                                </Pressable>
                            )}
                        </LinearGradient>

                        {/* Content */}
                        <View style={styles.content}>
                            {message && <Text style={styles.message}>{message}</Text>}
                            {children}
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            {defaultButtons.map((button, index) => (
                                <Pressable
                                    key={index}
                                    style={({ pressed }) => [
                                        styles.button,
                                        button.style === 'cancel' && styles.cancelButton,
                                        button.style === 'destructive' && styles.destructiveButton,
                                        defaultButtons.length === 1 && styles.singleButton,
                                        { opacity: pressed ? 0.8 : 1 },
                                    ]}
                                    onPress={() => handleButtonPress(button)}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            button.style === 'cancel' && styles.cancelButtonText,
                                            button.style === 'destructive' && styles.destructiveButtonText,
                                        ]}
                                    >
                                        {button.text}
                                    </Text>
                                </Pressable>
                            ))}
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
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    popup: {
        width: width * 0.85,
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    header: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        position: 'relative',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    message: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1CB0F6',
    },
    singleButton: {
        borderRadius: 0,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
    },
    destructiveButton: {
        backgroundColor: '#FF4B4B',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cancelButtonText: {
        color: '#666666',
    },
    destructiveButtonText: {
        color: '#FFFFFF',
    },
});

export default CustomPopup;
