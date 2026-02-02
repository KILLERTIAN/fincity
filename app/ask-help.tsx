import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const QUICK_AMOUNTS = [5, 10, 20];

const FRIENDS = [
    { id: 'leo', name: 'Leo', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Leo', badge: 'BESTIE', color: '#FFB800' },
    { id: 'mia', name: 'Mia', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Mia', badge: null, color: '#CE82FF' },
    { id: 'sam', name: 'Sam', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Sam', badge: null, color: '#1CB0F6' },
    { id: 'zoey', name: 'Zoey', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Zoey', badge: null, color: '#FF6B35' },
];

export default function AskForHelpScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [amount, setAmount] = useState(15);
    const [selectedFriends, setSelectedFriends] = useState<string[]>(['leo']);

    const toggleFriend = (friendId: string) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const adjustAmount = (delta: number) => {
        setAmount(Math.max(1, amount + delta));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.headerBtn,
                        { transform: [{ scale: pressed ? 0.9 : 1 }] }
                    ]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#1F1F1F" />
                </Pressable>
                <Text style={styles.headerTitle}>Ask for Help</Text>
                <Pressable style={styles.headerBtn}>
                    <Ionicons name="information-circle" size={24} color="#1CB0F6" />
                </Pressable>
            </View>

            <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Message Bubble */}
                    <View style={styles.messageBubble}>
                        <Text style={styles.messageText}>
                            Running low? Ask your squad for a boost!
                        </Text>
                    </View>

                    {/* Crown Icon */}
                    <View style={styles.crownContainer}>
                        <View style={styles.crownCircle}>
                            <Ionicons name="ribbon" size={50} color="white" />
                        </View>
                        <View style={styles.sparkle1}><Ionicons name="flash" size={24} color="#FFB800" /></View>
                        <View style={styles.sparkle2}><Ionicons name="flash" size={24} color="#FFB800" /></View>
                    </View>

                    {/* Amount Card - Premium Style */}
                    <View style={styles.amountCard}>
                        <Text style={styles.amountLabel}>REQUEST AMOUNT</Text>
                        <Text style={styles.amountDisplay}>₹{amount}</Text>

                        {/* Quick Amount Buttons */}
                        <View style={styles.quickAmounts}>
                            {QUICK_AMOUNTS.map((quickAmount) => (
                                <Pressable
                                    key={quickAmount}
                                    style={({ pressed }) => [
                                        styles.quickAmountBtn,
                                        { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                    ]}
                                    onPress={() => adjustAmount(quickAmount)}
                                >
                                    <Text style={styles.quickAmountText}>+₹{quickAmount}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Select Squad */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Select Squad</Text>
                        <Text style={styles.selectedCount}>{selectedFriends.length} Selected</Text>
                    </View>

                    <View style={styles.friendsGrid}>
                        {FRIENDS.map((friend) => {
                            const isSelected = selectedFriends.includes(friend.id);
                            return (
                                <Pressable
                                    key={friend.id}
                                    style={({ pressed }) => [
                                        styles.friendCard,
                                        isSelected && { borderColor: friend.color, borderWidth: 3 },
                                        { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                    ]}
                                    onPress={() => toggleFriend(friend.id)}
                                >
                                    {isSelected && (
                                        <View style={[styles.checkBadge, { backgroundColor: friend.color }]}>
                                            <Ionicons name="checkmark" size={16} color="white" />
                                        </View>
                                    )}
                                    <View style={[styles.friendAvatarBox, { backgroundColor: friend.color + '20' }]}>
                                        <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                                    </View>
                                    <Text style={styles.friendName}>{friend.name}</Text>
                                    {friend.badge && (
                                        <Text style={styles.friendBadge}>{friend.badge}</Text>
                                    )}
                                </Pressable>
                            );
                        })}

                        {/* Invite Button */}
                        <Pressable style={styles.inviteCard}>
                            <View style={styles.inviteIconBox}>
                                <Ionicons name="add" size={32} color="#8B8B8B" />
                            </View>
                            <Text style={styles.inviteText}>INVITE</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Bar - Premium Style */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }]}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>TOTAL REQUEST</Text>
                    <Text style={styles.totalAmount}>₹{amount.toFixed(2)}</Text>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        styles.sendButton,
                        { transform: [{ scale: pressed ? 0.98 : 1 }] },
                        selectedFriends.length === 0 && styles.sendButtonDisabled
                    ]}
                    onPress={() => {
                        if (selectedFriends.length > 0) {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        }
                    }}
                    disabled={selectedFriends.length === 0}
                >
                    <Text style={styles.sendButtonText}>SEND</Text>
                    <Ionicons name="arrow-forward" size={20} color="#1F1F1F" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBFF',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
        zIndex: 10,
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    messageBubble: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginTop: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    messageText: {
        fontSize: 15,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
    },
    crownContainer: {
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    crownCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFB800',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    crownIcon: {
        fontSize: 50,
    },
    sparkle1: {
        position: 'absolute',
        top: 20,
        left: '28%',
    },
    sparkle2: {
        position: 'absolute',
        top: 20,
        right: '28%',
    },
    amountCard: {
        backgroundColor: 'white',
        borderRadius: 36,
        padding: 32,
        marginBottom: 32,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
    amountLabel: {
        fontSize: 13,
        fontWeight: '900',
        color: '#1CB0F6',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: 12,
    },
    amountDisplay: {
        fontSize: 64,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
        marginBottom: 32,
    },
    quickAmounts: {
        flexDirection: 'row',
        gap: 12,
    },
    quickAmountBtn: {
        flex: 1,
        backgroundColor: '#F0F4FF',
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E8FF',
    },
    quickAmountText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    selectedCount: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1CB0F6',
    },
    friendsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    friendCard: {
        width: (width - 56) / 2,
        backgroundColor: 'white',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        position: 'relative',
    },
    checkBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'white',
        zIndex: 2,
    },
    friendAvatarBox: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    friendAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    friendName: {
        fontSize: 17,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    friendBadge: {
        fontSize: 11,
        fontWeight: '900',
        color: '#FFB800',
        letterSpacing: 0.8,
    },
    inviteCard: {
        width: (width - 56) / 2,
        backgroundColor: '#F8FBFF',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    inviteIconBox: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        backgroundColor: '#F0F0F0',
    },
    inviteText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 1.5,
    },
    bottomBar: {
        flexDirection: 'row',
        padding: 24,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 20,
        alignItems: 'center',
    },
    totalSection: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 11,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    sendButton: {
        flexDirection: 'row',
        backgroundColor: '#FFB800',
        paddingVertical: 18,
        paddingHorizontal: 36,
        borderRadius: 26,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    sendButtonDisabled: {
        backgroundColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },
    sendButtonText: {
        fontSize: 17,
        fontWeight: '900',
        color: '#1F1F1F',
        letterSpacing: 1,
    },
});
