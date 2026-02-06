import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { FloatingCoins } from '../animated/FloatingCoins';
import { GameButton } from '../ui/game-button';
import { GameCard } from '../ui/game-card';

interface LendingModalProps {
    visible: boolean;
    friend: {
        id: string;
        name: string;
        avatar: string;
        trustScore: number;
    } | null;
    onClose: () => void;
    onLend: (amount: number) => void;
    maxAmount: number;
}

export const LendingModal: React.FC<LendingModalProps> = ({
    visible,
    friend,
    onClose,
    onLend,
    maxAmount,
}) => {
    const [amount, setAmount] = useState('');
    const [showCoins, setShowCoins] = useState(false);

    const handleLend = () => {
        const lendAmount = parseFloat(amount);
        if (lendAmount > 0 && lendAmount <= maxAmount) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowCoins(true);
            setTimeout(() => {
                onLend(lendAmount);
                setAmount('');
                setShowCoins(false);
                onClose();
            }, 1500);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    if (!friend) return null;

    const suggestedAmounts = [5, 10, 20, 50];
    const interestRate = 5; // 5% interest
    const repaymentAmount = parseFloat(amount) * (1 + interestRate / 100) || 0;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <GameCard style={styles.card}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Lend Money</Text>
                            <Pressable onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#3C3C3C" />
                            </Pressable>
                        </View>

                        {/* Friend Info */}
                        <View style={styles.friendInfo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{friend.avatar}</Text>
                            </View>
                            <View>
                                <Text style={styles.friendName}>{friend.name}</Text>
                                <View style={styles.trustBadge}>
                                    <Ionicons name="shield-checkmark" size={14} color="#58CC02" />
                                    <Text style={styles.trustText}>Trust Score: {friend.trustScore}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Amount Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Amount to Lend</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.currencySymbol}>₹</Text>
                                <TextInput
                                    style={styles.input}
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="decimal-pad"
                                    placeholder="0.00"
                                    placeholderTextColor="#AFAFAF"
                                />
                            </View>
                            <Text style={styles.maxText}>Max: ₹{maxAmount.toFixed(2)}</Text>
                        </View>

                        {/* Quick Amount Buttons */}
                        <View style={styles.quickAmounts}>
                            {suggestedAmounts.map((suggested) => (
                                <Pressable
                                    key={suggested}
                                    style={styles.quickButton}
                                    onPress={() => {
                                        setAmount(suggested.toString());
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                >
                                    <Text style={styles.quickButtonText}>₹{suggested}</Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Loan Details */}
                        <View style={styles.loanDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Interest Rate</Text>
                                <Text style={styles.detailValue}>{interestRate}%</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>They'll Repay</Text>
                                <Text style={[styles.detailValue, styles.highlight]}>
                                    ₹{repaymentAmount.toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Your Profit</Text>
                                <Text style={[styles.detailValue, styles.profit]}>
                                    +₹{(repaymentAmount - parseFloat(amount || '0')).toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actions}>
                            <GameButton
                                title="Cancel"
                                onPress={onClose}
                                variant="secondary"
                                size="large"
                                style={styles.actionButton}
                            />
                            <GameButton
                                title="Lend Money"
                                onPress={handleLend}
                                variant="success"
                                size="large"
                                style={styles.actionButton}
                            />
                        </View>
                    </GameCard>
                </View>

                {showCoins && <FloatingCoins show={showCoins} amount={5} />}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    container: {
        width: '100%',
        maxWidth: 400,
    },
    card: {
        padding: Spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSizes.xxl,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
        padding: Spacing.md,
        backgroundColor: '#F8F8F8',
        borderRadius: BorderRadius.md,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#B8FF66',
        borderWidth: 3,
        borderColor: '#58CC02',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '900',
    },
    friendName: {
        fontSize: FontSizes.lg,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trustText: {
        fontSize: FontSizes.sm,
        fontWeight: '700',
        color: '#58CC02',
    },
    inputSection: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: '900',
        color: '#3C3C3C',
        marginBottom: Spacing.sm,
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#E5E5E5',
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    currencySymbol: {
        fontSize: FontSizes.xxl,
        fontWeight: '900',
        color: '#3C3C3C',
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: FontSizes.xxl,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    maxText: {
        fontSize: FontSizes.sm,
        fontWeight: '700',
        color: '#8B8B8B',
        marginTop: Spacing.xs,
    },
    quickAmounts: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    quickButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    quickButtonText: {
        fontSize: FontSizes.md,
        fontWeight: '900',
        color: '#3C3C3C',
    },
    loanDetails: {
        backgroundColor: '#FFF8E6',
        padding: Spacing.lg,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.lg,
        borderWidth: 2,
        borderColor: '#FFE5B4',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    detailLabel: {
        fontSize: FontSizes.md,
        fontWeight: '700',
        color: '#666',
    },
    detailValue: {
        fontSize: FontSizes.md,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    highlight: {
        color: '#1CB0F6',
    },
    profit: {
        color: '#58CC02',
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    actionButton: {
        flex: 1,
    },
});
