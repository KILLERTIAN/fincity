import { useAudio } from '@/contexts/audio-context';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface BuildingModalProps {
    visible: boolean;
    onClose: () => void;
    buildingType: 'bank' | 'market' | 'home' | 'guild' | 'hospital' | 'gym' | 'store' | 'tower2' | 'tower3' | null;
    buildingName?: string;
}

interface BuildingConfig {
    name: string;
    icon: string;
    gradient: [string, string];
    description: string;
}

const BUILDING_CONFIG: Record<string, BuildingConfig> = {
    bank: {
        name: 'Classic Bank',
        icon: 'business',
        gradient: ['#4b6cb7', '#182848'],
        description: 'Manage your savings and keep your money safe',
    },
    market: {
        name: 'City Market',
        icon: 'cart',
        gradient: ['#f093fb', '#f5576c'],
        description: 'Buy food and supplies to restore energy',
    },
    home: {
        name: 'Your Home',
        icon: 'home',
        gradient: ['#4facfe', '#00f2fe'],
        description: 'Rest and recover your energy',
    },
    guild: {
        name: 'Office Building',
        icon: 'briefcase',
        gradient: ['#43e97b', '#38f9d7'],
        description: 'Work to earn money or invest to improve character mood and stats',
    },
    hospital: {
        name: 'City Hospital',
        icon: 'medical',
        gradient: ['#fa709a', '#fee140'],
        description: 'Get healed and restore full energy',
    },
    gym: {
        name: 'Fitness Center',
        icon: 'fitness',
        gradient: ['#ff6b6b', '#feca57'],
        description: 'Workout to earn XP and boost your stats',
    },
    store: {
        name: 'General Store',
        icon: 'storefront',
        gradient: ['#a8edea', '#fed6e3'],
        description: 'Shop for items and upgrades',
    },
};

export const BuildingInteractionModal: React.FC<BuildingModalProps> = ({
    visible,
    onClose,
    buildingType,
    buildingName,
}) => {
    const { gameState, updatePlayerMoney, updatePlayerStats } = useGame();
    const { playSound, playHapticFeedback } = useAudio();
    const { player } = gameState;

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [result, setResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    if (!buildingType) return null;

    const effectiveType = buildingType === 'tower2' || buildingType === 'tower3' ? 'guild' : buildingType;
    const config = BUILDING_CONFIG[effectiveType as string];
    if (!config) return null;

    const handleAction = async (action: string) => {
        setLoading(true);
        setResult(null);
        playHapticFeedback('medium');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let message = '';
            let success = true;

            switch (effectiveType) {
                case 'bank':
                    if (action === 'deposit') {
                        const depositAmount = parseFloat(amount) || 0;
                        if (depositAmount <= 0) {
                            message = 'Enter a valid amount';
                            success = false;
                        } else if (depositAmount > player.money) {
                            message = 'Insufficient funds';
                            success = false;
                        } else {
                            updatePlayerMoney(-depositAmount, 'spend', 'Bank deposit');
                            message = `Deposited ₹${depositAmount.toFixed(2)}`;
                        }
                    } else if (action === 'withdraw') {
                        const withdrawAmount = parseFloat(amount) || 0;
                        if (withdrawAmount <= 0) {
                            message = 'Enter a valid amount';
                            success = false;
                        } else {
                            updatePlayerMoney(withdrawAmount, 'earn', 'Bank withdrawal');
                            message = `Withdrew ₹${withdrawAmount.toFixed(2)}`;
                        }
                    }
                    break;

                case 'market':
                    if (action === 'buy_food') {
                        const foodCost = 15;
                        if (player.money < foodCost) {
                            message = 'Not enough money for food';
                            success = false;
                        } else {
                            updatePlayerMoney(-foodCost, 'spend', 'Bought food at market');
                            message = 'Bought food! +15 Energy';
                        }
                    } else if (action === 'buy_supplies') {
                        const supplyCost = 25;
                        if (player.money < supplyCost) {
                            message = 'Not enough money for supplies';
                            success = false;
                        } else {
                            updatePlayerMoney(-supplyCost, 'spend', 'Bought supplies at market');
                            message = 'Bought supplies! +5 Energy';
                        }
                    }
                    break;

                case 'home':
                    if (action === 'rest') {
                        message = 'Rested at home! +30 Energy';
                    } else if (action === 'view_stats') {
                        Alert.alert('Your Stats',
                            `Level: ${player.level}\nXP: ${player.xp}/${player.requiredXP}\nMoney: ₹${player.money.toFixed(2)}\nStreak: ${player.streak} days\nTrust: ${player.trustScore}`
                        );
                        setLoading(false);
                        return;
                    }
                    break;

                case 'guild':
                    if (action === 'work') {
                        const reward = Math.floor(Math.random() * 41) + 30; // 30-70
                        updatePlayerStats({
                            money: player.money + reward,
                            energy: Math.max(0, player.energy - 20),
                            mood: Math.max(0, player.mood - 10),
                            xp: player.xp + 15
                        });
                        message = `Worked hard! Earned ₹${reward}. Mood decreased.`;
                    } else if (action === 'relax') {
                        const relaxCost = 20;
                        if (player.money < relaxCost) {
                            message = 'Not enough money to relax';
                            success = false;
                        } else {
                            updatePlayerStats({
                                money: player.money - relaxCost,
                                mood: Math.min(100, player.mood + 25)
                            });
                            message = 'Took a break! Feeling much better.';
                        }
                    } else if (action === 'invest') {
                        const investCost = 100;
                        if (player.money < investCost) {
                            message = 'Need ₹100 to invest';
                            success = false;
                        } else {
                            updatePlayerStats({
                                money: player.money - investCost,
                                xp: player.xp + 50,
                                trustScore: Math.min(100, player.trustScore + 5)
                            });
                            message = 'Invested in business! XP and Trust boosted.';
                        }
                    }
                    break;

                case 'hospital':
                    if (action === 'heal') {
                        const healCost = 30;
                        if (player.money < healCost) {
                            message = 'Not enough money for healing';
                            success = false;
                        } else {
                            updatePlayerMoney(-healCost, 'spend', 'Hospital healing');
                            message = 'Fully healed! Energy restored to 100';
                        }
                    }
                    break;

                case 'gym':
                    if (action === 'workout') {
                        const workoutCost = 10;
                        if (player.money < workoutCost) {
                            message = 'Not enough money for gym';
                            success = false;
                        } else {
                            updatePlayerMoney(-workoutCost, 'spend', 'Gym workout');
                            message = 'Great workout! +15 XP gained';
                        }
                    }
                    break;
            }

            setResult({ message, type: success ? 'success' : 'error' });

            if (success) {
                playSound('success');
            } else {
                playSound('error');
            }
        } catch (error) {
            setResult({ message: 'Something went wrong', type: 'error' });
        } finally {
            setLoading(false);
            setAmount('');
        }
    };

    const renderActions = () => {
        switch (effectiveType) {
            case 'bank':
                return (
                    <>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="Enter amount"
                            placeholderTextColor="#AFAFAF"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                        <View style={styles.actionRow}>
                            <ActionButton
                                label="Deposit"
                                icon="arrow-down-circle"
                                color="#58CC02"
                                onPress={() => handleAction('deposit')}
                                loading={loading}
                            />
                            <ActionButton
                                label="Withdraw"
                                icon="arrow-up-circle"
                                color="#1CB0F6"
                                onPress={() => handleAction('withdraw')}
                                loading={loading}
                            />
                        </View>
                        <View style={styles.balanceInfo}>
                            <Text style={styles.balanceLabel}>Current Balance</Text>
                            <Text style={styles.balanceValue}>₹{player.money.toFixed(2)}</Text>
                        </View>
                    </>
                );

            case 'market':
                return (
                    <View style={styles.actionGrid}>
                        <ActionCard
                            icon="fast-food"
                            title="Buy Food"
                            subtitle="₹15 • +15 Energy"
                            color="#FF6B35"
                            onPress={() => handleAction('buy_food')}
                            loading={loading}
                        />
                        <ActionCard
                            icon="bag-handle"
                            title="Buy Supplies"
                            subtitle="₹25 • +5 Energy"
                            color="#FFB800"
                            onPress={() => handleAction('buy_supplies')}
                            loading={loading}
                        />
                    </View>
                );

            case 'home':
                return (
                    <View style={styles.actionGrid}>
                        <ActionCard
                            icon="bed"
                            title="Rest"
                            subtitle="Free • +30 Energy"
                            color="#4facfe"
                            onPress={() => handleAction('rest')}
                            loading={loading}
                        />
                        <ActionCard
                            icon="stats-chart"
                            title="View Stats"
                            subtitle="Check your progress"
                            color="#764ba2"
                            onPress={() => handleAction('view_stats')}
                            loading={loading}
                        />
                    </View>
                );

            case 'guild':
                return (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                        <ActionCard
                            icon="briefcase"
                            title="Work"
                            subtitle="₹30-70 • -20 Energy"
                            color="#43e97b"
                            onPress={() => handleAction('work')}
                            loading={loading}
                        />
                        <ActionCard
                            icon="cafe"
                            title="Coffee Break"
                            subtitle="₹20 • +25 Mood"
                            color="#f6d365"
                            onPress={() => handleAction('relax')}
                            loading={loading}
                        />
                        <ActionCard
                            icon="trending-up"
                            title="Invest"
                            subtitle="₹100 • +50 XP"
                            color="#4facfe"
                            onPress={() => handleAction('invest')}
                            loading={loading}
                        />
                    </ScrollView>
                );

            case 'hospital':
                return (
                    <View style={styles.singleAction}>
                        <ActionCard
                            icon="medical"
                            title="Get Healed"
                            subtitle="₹30 • Full energy restore"
                            color="#fa709a"
                            onPress={() => handleAction('heal')}
                            loading={loading}
                            large
                        />
                    </View>
                );

            case 'gym':
                return (
                    <View style={styles.singleAction}>
                        <ActionCard
                            icon="barbell"
                            title="Workout"
                            subtitle="₹10 • +15 XP"
                            color="#ff6b6b"
                            onPress={() => handleAction('workout')}
                            loading={loading}
                            large
                        />
                    </View>
                );

            default:
                return (
                    <Text style={styles.comingSoon}>Coming soon!</Text>
                );
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <View style={styles.overlay}>
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        style={styles.modalContainer}
                    >
                        {/* Header */}
                        <LinearGradient
                            colors={config.gradient}
                            style={styles.header}
                        >
                            <View style={styles.headerContent}>
                                <View style={styles.headerIcon}>
                                    <Ionicons name={config.icon as any} size={32} color="white" />
                                </View>
                                <View style={styles.headerText}>
                                    <Text style={styles.buildingName}>{buildingName || config.name}</Text>
                                    <Text style={styles.buildingDesc}>{config.description}</Text>
                                </View>
                            </View>
                            <Pressable style={styles.closeBtn} onPress={onClose}>
                                <Ionicons name="close" size={24} color="white" />
                            </Pressable>
                        </LinearGradient>

                        {/* Content */}
                        <View style={styles.content}>
                            {result && (
                                <Animated.View
                                    entering={FadeIn}
                                    style={[
                                        styles.resultBanner,
                                        { backgroundColor: result.type === 'success' ? '#E8F5E9' : '#FFEBEE' }
                                    ]}
                                >
                                    <Ionicons
                                        name={result.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                                        size={20}
                                        color={result.type === 'success' ? '#58CC02' : '#FF4B4B'}
                                    />
                                    <Text style={[
                                        styles.resultText,
                                        { color: result.type === 'success' ? '#2E7D32' : '#C62828' }
                                    ]}>
                                        {result.message}
                                    </Text>
                                </Animated.View>
                            )}

                            {renderActions()}
                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// Action Button component
const ActionButton: React.FC<{
    label: string;
    icon: string;
    color: string;
    onPress: () => void;
    loading?: boolean;
}> = ({ label, icon, color, onPress, loading }) => (
    <Pressable
        style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: color, opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={onPress}
        disabled={loading}
    >
        {loading ? (
            <ActivityIndicator color="white" />
        ) : (
            <>
                <Ionicons name={icon as any} size={20} color="white" />
                <Text style={styles.actionBtnText}>{label}</Text>
            </>
        )}
    </Pressable>
);

// Action Card component
const ActionCard: React.FC<{
    icon: string;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
    loading?: boolean;
    large?: boolean;
}> = ({ icon, title, subtitle, color, onPress, loading, large }) => (
    <Pressable
        style={({ pressed }) => [
            styles.actionCard,
            large && styles.actionCardLarge,
            { transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]}
        onPress={onPress}
        disabled={loading}
    >
        <View style={[styles.actionCardIcon, { backgroundColor: color + '20' }]}>
            {loading ? (
                <ActivityIndicator color={color} />
            ) : (
                <Ionicons name={icon as any} size={28} color={color} />
            )}
        </View>
        <Text style={styles.actionCardTitle}>{title}</Text>
        <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 28,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 20,
    },
    headerIcon: {
        width: 64,
        height: 64,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    headerText: {
        flex: 1,
    },
    buildingName: {
        fontSize: 24,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 0.5,
    },
    buildingDesc: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
        lineHeight: 20,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 24,
        paddingBottom: 48,
    },
    resultBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        gap: 12,
    },
    resultText: {
        fontSize: 15,
        fontWeight: '800',
        flex: 1,
    },
    amountInput: {
        backgroundColor: '#F7F7F7',
        borderRadius: 24,
        padding: 20,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#EFEFEF',
        color: '#1F1F1F',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 16,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 24,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    actionBtnText: {
        fontSize: 17,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balanceInfo: {
        alignItems: 'center',
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1.5,
        borderTopColor: '#F5F5F5',
    },
    balanceLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#AFAFAF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balanceValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#58CC02',
        marginTop: 4,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    singleAction: {
        alignItems: 'center',
        flex: 1,
    },
    actionCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    actionCardLarge: {
        width: width - 80,
        paddingVertical: 30,
    },
    actionCardIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionCardTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    actionCardSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B8B8B',
        textAlign: 'center',
    },
    comingSoon: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B8B8B',
        textAlign: 'center',
        padding: 40,
    },
});

export default BuildingInteractionModal;
