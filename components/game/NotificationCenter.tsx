import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { GameButton } from '../ui/game-button';
import { GameCard } from '../ui/game-card';

interface Notification {
    id: string;
    type: 'friend_request' | 'loan_request' | 'help_request' | 'achievement' | 'daily_reward';
    title: string;
    message: string;
    timestamp: Date;
    data?: any;
    read: boolean;
}

interface NotificationCenterProps {
    visible: boolean;
    onClose: () => void;
    notifications: Notification[];
    onNotificationAction: (notification: Notification, action: 'accept' | 'decline') => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    visible,
    onClose,
    notifications,
    onNotificationAction,
}) => {
    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'friend_request':
                return { name: 'person-add' as const, color: '#1CB0F6' };
            case 'loan_request':
                return { name: 'cash' as const, color: '#FFB800' };
            case 'help_request':
                return { name: 'heart' as const, color: '#FF6B35' };
            case 'achievement':
                return { name: 'trophy' as const, color: '#CE82FF' };
            case 'daily_reward':
                return { name: 'gift' as const, color: '#58CC02' };
            default:
                return { name: 'notifications' as const, color: '#8B8B8B' };
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Notifications</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="white" />
                        </Pressable>
                    </View>

                    {/* Notifications List */}
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {notifications.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="notifications-off" size={64} color="#E5E5E5" />
                                <Text style={styles.emptyText}>No notifications yet</Text>
                                <Text style={styles.emptySubtext}>
                                    We'll notify you when something happens!
                                </Text>
                            </View>
                        ) : (
                            notifications.map((notification) => {
                                const icon = getNotificationIcon(notification.type);
                                const needsAction = ['friend_request', 'loan_request', 'help_request'].includes(
                                    notification.type
                                );

                                return (
                                    <GameCard
                                        key={notification.id}
                                        style={StyleSheet.flatten([
                                            styles.notificationCard,
                                            !notification.read && styles.unreadCard,
                                        ])}
                                    >
                                        <View style={styles.notificationContent}>
                                            <View
                                                style={[
                                                    styles.iconContainer,
                                                    { backgroundColor: icon.color + '20' },
                                                ]}
                                            >
                                                <Ionicons name={icon.name} size={24} color={icon.color} />
                                            </View>
                                            <View style={styles.notificationText}>
                                                <Text style={styles.notificationTitle}>
                                                    {notification.title}
                                                </Text>
                                                <Text style={styles.notificationMessage}>
                                                    {notification.message}
                                                </Text>
                                                <Text style={styles.notificationTime}>
                                                    {formatTime(notification.timestamp)}
                                                </Text>
                                            </View>
                                            {!notification.read && <View style={styles.unreadDot} />}
                                        </View>

                                        {needsAction && (
                                            <View style={styles.actions}>
                                                <GameButton
                                                    title="Decline"
                                                    onPress={() => {
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                        onNotificationAction(notification, 'decline');
                                                    }}
                                                    variant="secondary"
                                                    size="small"
                                                    style={styles.actionButton}
                                                />
                                                <GameButton
                                                    title="Accept"
                                                    onPress={() => {
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                                        onNotificationAction(notification, 'accept');
                                                    }}
                                                    variant="success"
                                                    size="small"
                                                    style={styles.actionButton}
                                                />
                                            </View>
                                        )}
                                    </GameCard>
                                );
                            })
                        )}
                        <View style={styles.bottomSpacing} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        flex: 1,
        marginTop: 100,
        backgroundColor: '#FAFAFA',
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.xl,
        backgroundColor: '#1CB0F6',
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
    },
    title: {
        fontSize: FontSizes.xxl,
        fontWeight: '900',
        color: 'white',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
        padding: Spacing.xl,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xxxl * 2,
    },
    emptyText: {
        fontSize: FontSizes.xl,
        fontWeight: '900',
        color: '#3C3C3C',
        marginTop: Spacing.lg,
    },
    emptySubtext: {
        fontSize: FontSizes.md,
        fontWeight: '600',
        color: '#8B8B8B',
        marginTop: Spacing.sm,
    },
    notificationCard: {
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#1CB0F6',
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    notificationText: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: FontSizes.md,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    notificationTime: {
        fontSize: FontSizes.xs,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1CB0F6',
        marginLeft: Spacing.sm,
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    actionButton: {
        flex: 1,
    },
    bottomSpacing: {
        height: 40,
    },
});
