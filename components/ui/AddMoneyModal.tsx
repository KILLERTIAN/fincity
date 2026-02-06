import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface AddMoneyModalProps {
    visible: boolean;
    onClose: () => void;
}

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

const SOURCES = [
    { id: 'allowance', name: 'Allowance', icon: 'wallet', color: '#58CC02', description: 'Weekly pocket money' },
    { id: 'gift', name: 'Gift Money', icon: 'gift', color: '#FF6B6B', description: 'Birthday/Festival gift' },
    { id: 'earned', name: 'Earned', icon: 'briefcase', color: '#1CB0F6', description: 'Chores or work' },
    { id: 'savings', name: 'Savings', icon: 'cash', color: '#FFB800', description: 'From piggy bank' },
];

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ visible, onClose }) => {
    const { updatePlayerMoney } = useGame();
    const [amount, setAmount] = useState('');
    const [selectedSource, setSelectedSource] = useState('allowance');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleQuickAmount = (value: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setAmount(value.toString());
    };

    const handleAddMoney = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const source = SOURCES.find(s => s.id === selectedSource);
        updatePlayerMoney(numAmount, 'earn', source?.name || 'Added money');

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setAmount('');
            onClose();
        }, 1500);
    };

    const handleClose = () => {
        setAmount('');
        setShowSuccess(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
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
                    <Pressable style={styles.backdrop} onPress={handleClose} />

                    <Animated.View
                        entering={SlideInDown.springify().damping(20).stiffness(200)}
                        exiting={SlideOutDown.duration(200)}
                        style={styles.modal}
                    >
                        {showSuccess ? (
                            <View style={styles.successContainer}>
                                <LinearGradient
                                    colors={['#58CC02', '#46A501']}
                                    style={styles.successGradient}
                                >
                                    <Animated.View entering={FadeIn.duration(300)}>
                                        <View style={styles.successIcon}>
                                            <Ionicons name="checkmark-circle" size={64} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.successTitle}>Money Added!</Text>
                                        <Text style={styles.successAmount}>+₹{amount}</Text>
                                    </Animated.View>
                                </LinearGradient>
                            </View>
                        ) : (
                            <>
                                {/* Header */}
                                <LinearGradient colors={['#58CC02', '#46A501']} style={styles.header}>
                                    <View style={styles.headerIcon}>
                                        <Ionicons name="add-circle" size={28} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.headerTitle}>Add Money</Text>
                                    <Pressable style={styles.closeBtn} onPress={handleClose}>
                                        <Ionicons name="close" size={24} color="rgba(255,255,255,0.8)" />
                                    </Pressable>
                                </LinearGradient>

                                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                                    {/* Amount Input */}
                                    <View style={styles.inputSection}>
                                        <Text style={styles.sectionLabel}>Enter Amount</Text>
                                        <View style={styles.amountInputContainer}>
                                            <Text style={styles.currencySymbol}>₹</Text>
                                            <TextInput
                                                style={styles.amountInput}
                                                value={amount}
                                                onChangeText={setAmount}
                                                placeholder="0"
                                                placeholderTextColor="#CCC"
                                                keyboardType="numeric"
                                                maxLength={6}
                                            />
                                        </View>
                                    </View>

                                    {/* Quick Amounts */}
                                    <View style={styles.quickAmountsSection}>
                                        <Text style={styles.sectionLabel}>Quick Select</Text>
                                        <View style={styles.quickAmountsGrid}>
                                            {QUICK_AMOUNTS.map((value) => (
                                                <Pressable
                                                    key={value}
                                                    style={({ pressed }) => [
                                                        styles.quickAmountBtn,
                                                        amount === value.toString() && styles.quickAmountBtnActive,
                                                        { opacity: pressed ? 0.8 : 1 },
                                                    ]}
                                                    onPress={() => handleQuickAmount(value)}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.quickAmountText,
                                                            amount === value.toString() && styles.quickAmountTextActive,
                                                        ]}
                                                    >
                                                        ₹{value}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Source Selection */}
                                    <View style={styles.sourceSection}>
                                        <Text style={styles.sectionLabel}>Money Source</Text>
                                        <View style={styles.sourceGrid}>
                                            {SOURCES.map((source) => (
                                                <Pressable
                                                    key={source.id}
                                                    style={({ pressed }) => [
                                                        styles.sourceCard,
                                                        selectedSource === source.id && styles.sourceCardActive,
                                                        { opacity: pressed ? 0.8 : 1 },
                                                    ]}
                                                    onPress={() => {
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                        setSelectedSource(source.id);
                                                    }}
                                                >
                                                    <View
                                                        style={[
                                                            styles.sourceIcon,
                                                            { backgroundColor: source.color + '20' },
                                                        ]}
                                                    >
                                                        <Ionicons name={source.icon as any} size={24} color={source.color} />
                                                    </View>
                                                    <Text style={styles.sourceName}>{source.name}</Text>
                                                    {selectedSource === source.id && (
                                                        <View style={[styles.checkmark, { backgroundColor: source.color }]}>
                                                            <Ionicons name="checkmark" size={12} color="#FFF" />
                                                        </View>
                                                    )}
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>

                                {/* Add Button */}
                                <View style={styles.footer}>
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.addButton,
                                            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                                        ]}
                                        onPress={handleAddMoney}
                                    >
                                        <LinearGradient
                                            colors={['#58CC02', '#46A501']}
                                            style={styles.addButtonGradient}
                                        >
                                            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                                            <Text style={styles.addButtonText}>Add ₹{amount || '0'}</Text>
                                        </LinearGradient>
                                    </Pressable>
                                </View>
                            </>
                        )}
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
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '85%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        flex: 1,
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    inputSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#666666',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#E8E8E8',
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '900',
        color: '#58CC02',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 36,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    quickAmountsSection: {
        marginBottom: 24,
    },
    quickAmountsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    quickAmountBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    quickAmountBtnActive: {
        backgroundColor: '#E8F5E9',
        borderColor: '#58CC02',
    },
    quickAmountText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#666666',
    },
    quickAmountTextActive: {
        color: '#58CC02',
    },
    sourceSection: {
        marginBottom: 20,
    },
    sourceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    sourceCard: {
        width: (width - 72) / 2,
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        alignItems: 'center',
        position: 'relative',
    },
    sourceCardActive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#58CC02',
        shadowColor: '#58CC02',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    sourceIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    sourceName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F1F1F',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    addButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    addButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    successContainer: {
        height: 300,
    },
    successGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIcon: {
        alignItems: 'center',
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    successAmount: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default AddMoneyModal;
