import { Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { GameCard } from '../ui/game-card';

export interface Quest {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    reward: {
        type: 'coins' | 'xp' | 'item' | 'gems';
        amount: number;
    };
    icon: string;
    color: string;
    completed: boolean;
}

interface DailyQuestCardProps {
    quest: Quest;
    onClaim?: (questId: string) => void;
}

export const DailyQuestCard: React.FC<DailyQuestCardProps> = ({
    quest,
    onClaim,
}) => {
    const progressPercentage = Math.min((quest.progress / quest.target) * 100, 100);
    const scale = useSharedValue(1);

    const handlePress = () => {
        if (quest.completed && onClaim) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            scale.value = withSpring(0.95, { damping: 10 }, () => {
                scale.value = withSpring(1);
            });
            onClaim(quest.id);
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <GameCard style={styles.card} animated={false}>
                <View style={styles.content}>
                    {/* Quest Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: quest.color + '20' }]}>
                        <Ionicons name={quest.icon as any} size={32} color={quest.color} />
                        {quest.completed && (
                            <View style={styles.completeBadge}>
                                <Ionicons name="checkmark-circle" size={20} color="#58CC02" />
                            </View>
                        )}
                    </View>

                    {/* Quest Info */}
                    <View style={styles.info}>
                        <Text style={styles.title}>{quest.title}</Text>
                        <Text style={styles.description}>{quest.description}</Text>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBackground}>
                                <Animated.View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: `${progressPercentage}%`,
                                            backgroundColor: quest.completed ? '#58CC02' : quest.color,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {quest.progress}/{quest.target}
                            </Text>
                        </View>

                        {/* Reward */}
                        <View style={styles.rewardContainer}>
                            <Text style={styles.rewardIcon}>
                                {quest.reward.type === 'coins' ? '💰' :
                                    quest.reward.type === 'xp' ? '⭐' : '🎁'}
                            </Text>
                            <Text style={styles.rewardText}>
                                +{quest.reward.amount} {quest.reward.type.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Claim Button */}
                    {quest.completed && (
                        <Pressable
                            style={styles.claimButton}
                            onPress={handlePress}
                        >
                            <Ionicons name="gift" size={24} color="white" />
                        </Pressable>
                    )}
                </View>
            </GameCard>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: Spacing.md,
        marginBottom: Spacing.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
        position: 'relative',
    },
    completeBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 2,
    },
    description: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: Spacing.sm,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    progressBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#8B8B8B',
        minWidth: 40,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rewardIcon: {
        fontSize: 14,
    },
    rewardText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#FFB800',
    },
    claimButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#58CC02',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#46A302',
        borderBottomWidth: 4,
        marginLeft: Spacing.sm,
    },
});
