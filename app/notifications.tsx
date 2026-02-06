import { GameCard } from '@/components/ui/game-card';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Layout, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock notifications data
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'loan_request',
        title: 'Loan Request',
        message: 'Leo wants to borrow ₹50 for a snack',
        timestamp: new Date(Date.now() - 300000),
        avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Leo',
        data: { friendId: '8', amount: 50 },
        read: false,
    },
    {
        id: '2',
        type: 'achievement',
        title: 'Achievement Unlocked! 🏆',
        message: 'You reached a 7-day streak!',
        timestamp: new Date(Date.now() - 600000),
        read: false,
    },
    {
        id: '3',
        type: 'friend_request',
        title: 'New Friend Request',
        message: 'Maya wants to be your friend',
        timestamp: new Date(Date.now() - 3600000),
        avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Maya',
        data: { friendId: '9', name: 'Maya' },
        read: false,
    },
    {
        id: '4',
        type: 'help_request',
        title: 'Help Request',
        message: 'Sam needs ₹30 for bus fare',
        timestamp: new Date(Date.now() - 7200000),
        avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Sam',
        data: { friendId: '10', amount: 30 },
        read: true,
    },
    {
        id: '5',
        type: 'daily_reward',
        title: 'Daily Reward Ready! 🎁',
        message: 'Claim your daily bonus of ₹10!',
        timestamp: new Date(Date.now() - 86400000),
        data: { amount: 10 },
        read: true,
    },
    {
        id: '6',
        type: 'quiz_reminder',
        title: 'Quiz Available! 📚',
        message: 'New quiz "Budgeting Basics" is ready',
        timestamp: new Date(Date.now() - 172800000),
        read: true,
    },
];

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'loan_request': return { icon: 'cash', color: '#FF9600', bg: '#FFF3E0' };
        case 'achievement': return { icon: 'trophy', color: '#FFB800', bg: '#FFF9E6' };
        case 'friend_request': return { icon: 'person-add', color: '#1CB0F6', bg: '#E6F4FF' };
        case 'help_request': return { icon: 'hand-left', color: '#CE82FF', bg: '#F3E5F5' };
        case 'daily_reward': return { icon: 'gift', color: '#58CC02', bg: '#E8F5E9' };
        case 'quiz_reminder': return { icon: 'school', color: '#FF6B35', bg: '#FFEBE6' };
        default: return { icon: 'notifications', color: '#8B8B8B', bg: '#F5F5F5' };
    }
};

const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export default function NotificationsScreen() {
    const router = useRouter();
    const { gameState, markNotificationRead, handleNotificationAction } = useGame();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = filter === 'all' ? notifications : notifications.filter(n => !n.read);

    const handleNotificationPress = (notif: typeof MOCK_NOTIFICATIONS[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Mark as read
        setNotifications(prev =>
            prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
        );
    };

    const handleAccept = (notif: typeof MOCK_NOTIFICATIONS[0]) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Remove notification with animation
        setNotifications(prev => prev.filter(n => n.id !== notif.id));

        // Show success feedback based on type
        if (notif.type === 'friend_request') {
            // Navigate to social or show toast
        } else if (notif.type === 'loan_request' || notif.type === 'help_request') {
            router.push('/send-cash');
        } else if (notif.type === 'daily_reward') {
            // Add reward to player
        }
    };

    const handleDecline = (notif: typeof MOCK_NOTIFICATIONS[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
    };

    const clearAllRead = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setNotifications(prev => prev.filter(n => !n.read));
    };

    const markAllAsRead = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <View style={styles.container}>
            <ScreenWrapper>
                <StatusBar style="dark" />
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable
                            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
                        </Pressable>
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle}>Notifications</Text>
                            {unreadCount > 0 && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </View>
                        <Pressable
                            style={({ pressed }) => [styles.moreBtn, { opacity: pressed ? 0.6 : 1 }]}
                            onPress={markAllAsRead}
                        >
                            <Ionicons name="checkmark-done" size={24} color="#1CB0F6" />
                        </Pressable>
                    </View>

                    {/* Filter Tabs */}
                    <View style={styles.filterContainer}>
                        <Pressable
                            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                            onPress={() => setFilter('all')}
                        >
                            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                                All
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
                            onPress={() => setFilter('unread')}
                        >
                            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
                                Unread ({unreadCount})
                            </Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {filteredNotifications.length === 0 ? (
                            <Animated.View
                                entering={FadeIn}
                                style={styles.emptyState}
                            >
                                <View style={styles.emptyIconBox}>
                                    <Ionicons name="notifications-off-outline" size={64} color="#AFAFAF" />
                                </View>
                                <Text style={styles.emptyTitle}>All Caught Up! 🎉</Text>
                                <Text style={styles.emptySubtitle}>
                                    No {filter === 'unread' ? 'unread ' : ''}notifications right now
                                </Text>
                            </Animated.View>
                        ) : (
                            filteredNotifications.map((notif, index) => {
                                const iconData = getNotificationIcon(notif.type);
                                const hasActions = ['loan_request', 'friend_request', 'help_request', 'daily_reward'].includes(notif.type);

                                return (
                                    <Animated.View
                                        key={notif.id}
                                        entering={SlideInRight.delay(index * 50)}
                                        exiting={SlideOutRight}
                                        layout={Layout.springify()}
                                    >
                                        <Pressable
                                            onPress={() => handleNotificationPress(notif)}
                                            style={({ pressed }) => [
                                                { transform: [{ scale: pressed ? 0.98 : 1 }] }
                                            ]}
                                        >
                                            <GameCard style={[
                                                styles.notificationCard,
                                                !notif.read && styles.unreadCard
                                            ]}>
                                                {!notif.read && <View style={styles.unreadDot} />}

                                                <View style={styles.notifTop}>
                                                    {notif.avatar ? (
                                                        <View style={styles.avatarContainer}>
                                                            <Image
                                                                source={{ uri: notif.avatar }}
                                                                style={styles.avatar}
                                                            />
                                                            <View style={[styles.typeIconSmall, { backgroundColor: iconData.bg }]}>
                                                                <Ionicons name={iconData.icon as any} size={12} color={iconData.color} />
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <View style={[styles.iconBox, { backgroundColor: iconData.bg }]}>
                                                            <Ionicons name={iconData.icon as any} size={28} color={iconData.color} />
                                                        </View>
                                                    )}

                                                    <View style={styles.notifContent}>
                                                        <Text style={styles.notifTitle}>{notif.title}</Text>
                                                        <Text style={styles.notifMessage}>{notif.message}</Text>
                                                        <Text style={styles.notifTime}>{formatTimeAgo(notif.timestamp)}</Text>
                                                    </View>
                                                </View>

                                                {/* Action Buttons */}
                                                {hasActions && !notif.read && (
                                                    <View style={styles.actionRow}>
                                                        <Pressable
                                                            style={({ pressed }) => [
                                                                styles.declineBtn,
                                                                { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                                            ]}
                                                            onPress={() => handleDecline(notif)}
                                                        >
                                                            <Ionicons name="close" size={18} color="#FF4B4B" />
                                                            <Text style={styles.declineBtnText}>Decline</Text>
                                                        </Pressable>
                                                        <Pressable
                                                            style={({ pressed }) => [
                                                                styles.acceptBtn,
                                                                { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                                            ]}
                                                            onPress={() => handleAccept(notif)}
                                                        >
                                                            <Ionicons name="checkmark" size={18} color="white" />
                                                            <Text style={styles.acceptBtnText}>
                                                                {notif.type === 'daily_reward' ? 'Claim' : 'Accept'}
                                                            </Text>
                                                        </Pressable>
                                                    </View>
                                                )}
                                            </GameCard>
                                        </Pressable>
                                    </Animated.View>
                                );
                            })
                        )}

                        {/* Clear Read Button */}
                        {notifications.some(n => n.read) && (
                            <Pressable
                                style={styles.clearBtn}
                                onPress={clearAllRead}
                            >
                                <Ionicons name="trash-outline" size={18} color="#FF4B4B" />
                                <Text style={styles.clearBtnText}>Clear Read Notifications</Text>
                            </Pressable>
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>

                </SafeAreaView>
            </ScreenWrapper>
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
        paddingVertical: 12,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    unreadBadge: {
        backgroundColor: '#FF4B4B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    unreadBadgeText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'white',
    },
    moreBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 16,
    },
    filterTab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    filterTabActive: {
        backgroundColor: '#1CB0F6',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#8B8B8B',
    },
    filterTextActive: {
        color: 'white',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    notificationCard: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 24,
        position: 'relative',
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#1CB0F6',
    },
    unreadDot: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1CB0F6',
    },
    notifTop: {
        flexDirection: 'row',
        gap: 14,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    typeIconSmall: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifContent: {
        flex: 1,
    },
    notifTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    notifMessage: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B8B8B',
        marginBottom: 6,
    },
    notifTime: {
        fontSize: 12,
        fontWeight: '600',
        color: '#AFAFAF',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    declineBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: '#FFE6E6',
        gap: 6,
    },
    declineBtnText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FF4B4B',
    },
    acceptBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: '#58CC02',
        gap: 6,
    },
    acceptBtnText: {
        fontSize: 14,
        fontWeight: '900',
        color: 'white',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIconBox: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 8,
        gap: 8,
    },
    clearBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FF4B4B',
    },
});
