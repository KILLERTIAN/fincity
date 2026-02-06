import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TransferMoneyModalProps {
    visible: boolean;
    onClose: () => void;
    preSelectedFriend?: {
        id: string;
        name: string;
        avatar: string;
    };
}

interface Friend {
    id: string;
    name: string;
    avatar: string;
    level?: number;
    trustScore?: number;
}

// Mock friends list (in production, fetch from API)
const MOCK_FRIENDS: Friend[] = [
    { id: '1', name: 'Candy', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Candy', level: 10, trustScore: 92 },
    { id: '2', name: 'KraPex', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=KraPex', level: 8, trustScore: 88 },
    { id: '3', name: 'Necrosma', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Necrosma', level: 12, trustScore: 85 },
    { id: '4', name: 'Baigan', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Baigan', level: 8, trustScore: 78 },
    { id: '5', name: 'Astral Monk', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Astral', level: 5, trustScore: 95 },
];

type TransferMode = 'send' | 'request';

export const TransferMoneyModal: React.FC<TransferMoneyModalProps> = ({
    visible,
    onClose,
    preSelectedFriend,
}) => {
    const { gameState, updatePlayerMoney, refreshProfile } = useGame();
    const { player } = gameState;
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isLargeScreen = width > 768;

    const [mode, setMode] = useState<TransferMode>('send');
    const [step, setStep] = useState<'select' | 'amount' | 'confirm' | 'success'>('select');
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(preSelectedFriend || null);
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Friend[]>([]);
    const [searching, setSearching] = useState(false);

    const modalWidth = isLargeScreen ? 520 : width;

    const resetModal = () => {
        setStep('select');
        setSelectedFriend(preSelectedFriend || null);
        setAmount('');
        setMessage('');
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            // In production, use API
            // const results = await userApi.searchUsers(query);
            // For now, filter mock data
            const results = MOCK_FRIENDS.filter(f =>
                f.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    }, []);

    const handleSelectFriend = (friend: Friend) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedFriend(friend);
        setStep('amount');
    };

    const handleAmountContinue = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        if (mode === 'send' && numAmount > player.money) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setStep('confirm');
    };

    const handleTransfer = async () => {
        if (!selectedFriend) return;

        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const numAmount = parseFloat(amount);

            if (mode === 'send') {
                // In production:
                // await userApi.sendMoney(selectedFriend.id, numAmount, message);

                // Simulated transfer
                updatePlayerMoney(-numAmount, 'spend', `Sent to ${selectedFriend.name}`);
            } else {
                // In production:
                // await userApi.requestMoney(selectedFriend.id, numAmount, message);
            }

            await refreshProfile();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStep('success');
        } catch (error) {
            console.error('Transfer error:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setLoading(false);
        }
    };

    const QUICK_AMOUNTS = [50, 100, 200, 500];

    const renderSelectStep = () => (
        <Animated.View entering={FadeIn} style={styles.stepContent}>
            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
                <Pressable
                    style={[styles.modeBtn, mode === 'send' && styles.modeBtnActive]}
                    onPress={() => setMode('send')}
                >
                    <Ionicons
                        name="arrow-up-circle"
                        size={20}
                        color={mode === 'send' ? '#FFFFFF' : '#666666'}
                    />
                    <Text style={[styles.modeBtnText, mode === 'send' && styles.modeBtnTextActive]}>
                        Send
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.modeBtn, mode === 'request' && styles.modeBtnActiveRequest]}
                    onPress={() => setMode('request')}
                >
                    <Ionicons
                        name="arrow-down-circle"
                        size={20}
                        color={mode === 'request' ? '#FFFFFF' : '#666666'}
                    />
                    <Text style={[styles.modeBtnText, mode === 'request' && styles.modeBtnTextActive]}>
                        Request
                    </Text>
                </Pressable>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999999" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name..."
                    placeholderTextColor="#999999"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                {searching && <ActivityIndicator size="small" color="#1CB0F6" />}
            </View>

            {/* Friends List */}
            <Text style={styles.sectionLabel}>
                {searchQuery.length > 0 ? 'Search Results' : 'Recent Friends'}
            </Text>
            <ScrollView
                style={styles.friendsList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.friendsListContent,
                    isLargeScreen && styles.friendsListContentWeb
                ]}
            >
                {(searchQuery.length > 0 ? searchResults : MOCK_FRIENDS).map((friend) => (
                    <Pressable
                        key={friend.id}
                        style={({ pressed }) => [
                            styles.friendCard,
                            isLargeScreen && styles.friendCardWeb,
                            { opacity: pressed ? 0.8 : 1 }
                        ]}
                        onPress={() => handleSelectFriend(friend)}
                    >
                        <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                        <View style={styles.friendInfo}>
                            <Text style={styles.friendName}>{friend.name}</Text>
                            <Text style={styles.friendLevel}>Level {friend.level}</Text>
                        </View>
                        <View style={styles.trustBadge}>
                            <Ionicons name="shield-checkmark" size={14} color="#58CC02" />
                            <Text style={styles.trustScore}>{friend.trustScore}%</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </Animated.View>
    );

    const renderAmountStep = () => (
        <Animated.View entering={FadeInDown} style={styles.stepContent}>
            {/* Selected Friend */}
            {selectedFriend && (
                <View style={styles.selectedFriendCard}>
                    <Image source={{ uri: selectedFriend.avatar }} style={styles.selectedAvatar} />
                    <View>
                        <Text style={styles.selectedName}>{selectedFriend.name}</Text>
                        <Text style={styles.selectedAction}>
                            {mode === 'send' ? 'Sending to' : 'Requesting from'}
                        </Text>
                    </View>
                    <Pressable
                        style={styles.changeBtn}
                        onPress={() => setStep('select')}
                    >
                        <Text style={styles.changeBtnText}>Change</Text>
                    </Pressable>
                </View>
            )}

            {/* Amount Input */}
            <View style={styles.amountSection}>
                <Text style={styles.sectionLabel}>Enter Amount</Text>
                <View style={styles.amountInputContainer}>
                    <Text style={[
                        styles.currencySymbol,
                        { color: mode === 'send' ? '#FF6B6B' : '#58CC02' }
                    ]}>₹</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0"
                        placeholderTextColor="#CCC"
                        keyboardType="numeric"
                        maxLength={6}
                        autoFocus
                    />
                </View>
                {mode === 'send' && (
                    <Text style={styles.balanceHint}>
                        Available: ₹{player.money.toLocaleString('en-IN')}
                    </Text>
                )}
            </View>

            {/* Quick Amounts */}
            <View style={styles.quickAmounts}>
                {QUICK_AMOUNTS.map((value) => (
                    <Pressable
                        key={value}
                        style={({ pressed }) => [
                            styles.quickAmountBtn,
                            amount === value.toString() && styles.quickAmountBtnActive,
                            { opacity: pressed ? 0.8 : 1 }
                        ]}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setAmount(value.toString());
                        }}
                    >
                        <Text style={[
                            styles.quickAmountText,
                            amount === value.toString() && styles.quickAmountTextActive
                        ]}>₹{value}</Text>
                    </Pressable>
                ))}
            </View>

            {/* Message */}
            <View style={styles.messageSection}>
                <Text style={styles.sectionLabel}>Add a note (optional)</Text>
                <TextInput
                    style={styles.messageInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="What's this for?"
                    placeholderTextColor="#999999"
                    maxLength={100}
                />
            </View>

            {/* Continue Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.continueBtn,
                    { opacity: pressed ? 0.9 : 1 }
                ]}
                onPress={handleAmountContinue}
            >
                <LinearGradient
                    colors={mode === 'send' ? ['#FF6B6B', '#FF4757'] : ['#58CC02', '#46A501']}
                    style={styles.continueBtnGradient}
                >
                    <Text style={styles.continueBtnText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );

    const renderConfirmStep = () => (
        <Animated.View entering={FadeInDown} style={styles.stepContent}>
            <View style={styles.confirmCard}>
                <View style={styles.confirmHeader}>
                    <Ionicons
                        name={mode === 'send' ? 'arrow-up-circle' : 'arrow-down-circle'}
                        size={48}
                        color={mode === 'send' ? '#FF6B6B' : '#58CC02'}
                    />
                    <Text style={styles.confirmTitle}>
                        {mode === 'send' ? 'Send Money' : 'Request Money'}
                    </Text>
                </View>

                <View style={styles.confirmAmount}>
                    <Text style={styles.confirmAmountLabel}>Amount</Text>
                    <Text style={[
                        styles.confirmAmountValue,
                        { color: mode === 'send' ? '#FF6B6B' : '#58CC02' }
                    ]}>
                        ₹{parseFloat(amount).toLocaleString('en-IN')}
                    </Text>
                </View>

                {selectedFriend && (
                    <View style={styles.confirmRecipient}>
                        <Text style={styles.confirmRecipientLabel}>
                            {mode === 'send' ? 'To' : 'From'}
                        </Text>
                        <View style={styles.confirmRecipientInfo}>
                            <Image source={{ uri: selectedFriend.avatar }} style={styles.confirmAvatar} />
                            <Text style={styles.confirmRecipientName}>{selectedFriend.name}</Text>
                        </View>
                    </View>
                )}

                {message && (
                    <View style={styles.confirmMessage}>
                        <Text style={styles.confirmMessageLabel}>Note</Text>
                        <Text style={styles.confirmMessageText}>"{message}"</Text>
                    </View>
                )}
            </View>

            <View style={styles.confirmButtons}>
                <Pressable
                    style={styles.cancelBtn}
                    onPress={() => setStep('amount')}
                >
                    <Text style={styles.cancelBtnText}>Back</Text>
                </Pressable>
                <Pressable
                    style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
                    onPress={handleTransfer}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={mode === 'send' ? ['#FF6B6B', '#FF4757'] : ['#58CC02', '#46A501']}
                        style={styles.confirmBtnGradient}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons
                                    name={mode === 'send' ? 'send' : 'hand-right'}
                                    size={20}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.confirmBtnText}>
                                    {mode === 'send' ? 'Send Now' : 'Request'}
                                </Text>
                            </>
                        )}
                    </LinearGradient>
                </Pressable>
            </View>
        </Animated.View>
    );

    const renderSuccessStep = () => (
        <Animated.View entering={FadeIn} style={styles.successContainer}>
            <LinearGradient
                colors={mode === 'send' ? ['#FF6B6B', '#FF4757'] : ['#58CC02', '#46A501']}
                style={styles.successGradient}
            >
                <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={80} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>
                    {mode === 'send' ? 'Money Sent!' : 'Request Sent!'}
                </Text>
                <Text style={styles.successAmount}>₹{parseFloat(amount).toLocaleString('en-IN')}</Text>
                {selectedFriend && (
                    <Text style={styles.successRecipient}>
                        {mode === 'send' ? 'to' : 'from'} {selectedFriend.name}
                    </Text>
                )}
                <Pressable style={styles.doneBtn} onPress={handleClose}>
                    <Text style={styles.doneBtnText}>Done</Text>
                </Pressable>
            </LinearGradient>
        </Animated.View>
    );

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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={[styles.overlay, isWeb && isLargeScreen && styles.overlayWeb]}
                >
                    <Pressable style={styles.backdrop} onPress={handleClose} />

                    <Animated.View
                        entering={SlideInDown.duration(300)}
                        exiting={SlideOutDown.duration(200)}
                        style={[
                            styles.modal,
                            isLargeScreen && {
                                width: modalWidth,
                                alignSelf: 'center',
                                borderRadius: 32,
                                shadowOpacity: 0.3,
                                shadowRadius: 50,
                                elevation: 25,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.2)'
                            }
                        ]}
                    >
                        {step === 'success' ? (
                            renderSuccessStep()
                        ) : (
                            <>
                                {/* Header */}
                                <LinearGradient
                                    colors={mode === 'send' ? ['#FF6B6B', '#FF4757'] : ['#58CC02', '#46A501']}
                                    style={styles.header}
                                >
                                    <View style={styles.headerIcon}>
                                        <Ionicons
                                            name={mode === 'send' ? 'send' : 'download'}
                                            size={24}
                                            color="#FFFFFF"
                                        />
                                    </View>
                                    <Text style={styles.headerTitle}>
                                        {mode === 'send' ? 'Send Money' : 'Request Money'}
                                    </Text>
                                    <Pressable style={styles.closeBtn} onPress={handleClose}>
                                        <Ionicons name="close" size={24} color="rgba(255,255,255,0.8)" />
                                    </Pressable>
                                </LinearGradient>

                                {/* Steps */}
                                <View style={styles.stepsIndicator}>
                                    {['select', 'amount', 'confirm'].map((s, i) => (
                                        <View
                                            key={s}
                                            style={[
                                                styles.stepDot,
                                                (step === s ||
                                                    (step === 'amount' && i === 0) ||
                                                    (step === 'confirm' && i <= 1)
                                                ) && styles.stepDotActive,
                                                { backgroundColor: mode === 'send' ? '#FF6B6B' : '#58CC02' }
                                            ]}
                                        />
                                    ))}
                                </View>

                                {/* Content */}
                                {step === 'select' && renderSelectStep()}
                                {step === 'amount' && renderAmountStep()}
                                {step === 'confirm' && renderConfirmStep()}
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
    overlayWeb: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modal: {
        backgroundColor: '#FAFBFC',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: '90%',
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
    stepsIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    stepDotActive: {
        width: 24,
    },
    stepContent: {
        padding: 20,
        paddingBottom: 40,
    },
    modeToggle: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    modeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
    },
    modeBtnActive: {
        backgroundColor: '#FF6B6B',
    },
    modeBtnActiveRequest: {
        backgroundColor: '#58CC02',
    },
    modeBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#666666',
    },
    modeBtnTextActive: {
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#1F1F1F',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#666666',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    friendsList: {
        maxHeight: 300,
    },
    friendsListContent: {
        gap: 10,
    },
    friendsListContentWeb: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    friendCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    friendCardWeb: {
        width: '48%',
        marginRight: '2%',
    },
    friendAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F0F0',
    },
    friendInfo: {
        flex: 1,
        marginLeft: 12,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F1F1F',
    },
    friendLevel: {
        fontSize: 13,
        color: '#888888',
        marginTop: 2,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    trustScore: {
        fontSize: 13,
        fontWeight: '700',
        color: '#58CC02',
    },
    selectedFriendCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#1CB0F6',
    },
    selectedAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F0F0F0',
    },
    selectedName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F1F1F',
        marginLeft: 16,
    },
    selectedAction: {
        fontSize: 14,
        color: '#888888',
        marginLeft: 16,
    },
    changeBtn: {
        marginLeft: 'auto',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
    },
    changeBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
    },
    amountSection: {
        marginBottom: 20,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#E8E8E8',
    },
    currencySymbol: {
        fontSize: 36,
        fontWeight: '900',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 36,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    balanceHint: {
        fontSize: 14,
        color: '#888888',
        marginTop: 8,
        textAlign: 'right',
    },
    quickAmounts: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    quickAmountBtn: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        alignItems: 'center',
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
    messageSection: {
        marginBottom: 24,
    },
    messageInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F1F1F',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    continueBtn: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    continueBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    continueBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    confirmCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },
    confirmHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    confirmTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F1F1F',
        marginTop: 12,
    },
    confirmAmount: {
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    confirmAmountLabel: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 8,
    },
    confirmAmountValue: {
        fontSize: 48,
        fontWeight: '900',
    },
    confirmRecipient: {
        alignItems: 'center',
        marginBottom: 20,
    },
    confirmRecipientLabel: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 12,
    },
    confirmRecipientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    confirmAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    confirmRecipientName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F1F1F',
    },
    confirmMessage: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
    },
    confirmMessageLabel: {
        fontSize: 12,
        color: '#888888',
        marginBottom: 4,
    },
    confirmMessageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F1F1F',
        fontStyle: 'italic',
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 18,
        backgroundColor: '#F0F0F0',
        borderRadius: 16,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#666666',
    },
    confirmBtn: {
        flex: 2,
        borderRadius: 16,
        overflow: 'hidden',
    },
    confirmBtnDisabled: {
        opacity: 0.7,
    },
    confirmBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    confirmBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    successContainer: {
        height: 400,
    },
    successGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    successIcon: {
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    successAmount: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    successRecipient: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 32,
    },
    doneBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    doneBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});

export default TransferMoneyModal;
