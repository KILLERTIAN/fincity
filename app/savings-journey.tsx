import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const MILESTONES = [
    { id: 'm1', amount: 50, title: 'First Milestone', status: 'earned', icon: 'checkmark-circle' },
    { id: 'm2', amount: 100, title: 'Kickstand Pro', status: 'earned', icon: 'checkmark-circle' },
    { id: 'm3', amount: 150, title: 'Helmet & Pads', status: 'next', icon: 'star' },
    { id: 'm4', amount: 200, title: 'Ultimate Victory', status: 'locked', icon: 'lock-closed' },
];

const REWARDS = [
    { id: 'r1', title: 'STARTER', icon: 'trophy', color: '#FFB800' },
    { id: 'r2', title: 'FAST SAVER', icon: 'flash', color: '#1CB0F6' },
    { id: 'r3', title: '7 DAY\nSTREAK', icon: 'calendar', color: '#46A302' },
];

export default function SavingsJourneyScreen() {
    const router = useRouter();
    const [currentSavings] = useState(130);
    const goalAmount = 200;
    const progress = (currentSavings / goalAmount) * 100;

    const handleAddSavings = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // TODO: Implement add savings logic
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        { opacity: pressed ? 0.6 : 1 }
                    ]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                >
                    <Ionicons name="chevron-back" size={28} color="#1F1F1F" />
                </Pressable>
                <Text style={styles.headerTitle}>Savings Journey</Text>
                <Pressable style={styles.helpButton}>
                    <Ionicons name="help-circle" size={28} color="#FFB800" />
                </Pressable>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Goal Card */}
                <View style={styles.goalCard}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>LEVEL 4</Text>
                    </View>

                    <View style={styles.bikeIconCircle}>
                        <Ionicons name="bicycle" size={56} color="#FFB800" />
                    </View>

                    <Text style={styles.goalTitle}>New Pro Bike</Text>
                    <Text style={styles.goalSubtitle}>DREAM GOAL</Text>

                    <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>ACTIVE</Text>
                    </View>

                    <View style={styles.amountRow}>
                        <Text style={styles.currentAmount}>₹{currentSavings}</Text>
                        <Text style={styles.goalAmountText}>/ ₹{goalAmount}</Text>
                    </View>

                    <View style={styles.percentBadge}>
                        <Text style={styles.percentText}>{Math.round(progress)}%</Text>
                    </View>

                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>

                {/* Level Map */}
                <Text style={styles.sectionTitle}>Level Map</Text>
                <Text style={styles.sectionSubtitle}>Climb the mountain to reach your goal!</Text>

                <View style={styles.milestonesContainer}>
                    {MILESTONES.map((milestone) => (
                        <View key={milestone.id} style={styles.milestoneRow}>
                            <View style={[
                                styles.milestoneIconCircle,
                                milestone.status === 'locked' && styles.milestoneIconLocked,
                                milestone.status === 'next' && styles.milestoneIconNext,
                                milestone.status === 'earned' && styles.milestoneIconEarned,
                            ]}>
                                <Ionicons
                                    name={milestone.icon as any}
                                    size={24}
                                    color="white"
                                />
                            </View>
                            <View style={[
                                styles.milestoneCard,
                                milestone.status === 'next' && styles.milestoneCardNext,
                            ]}>
                                <View style={styles.milestoneContent}>
                                    <Text style={styles.milestoneAmount}>₹{milestone.amount}: {milestone.title}</Text>
                                    {milestone.status === 'next' && (
                                        <Text style={styles.milestoneStatus}>NEXT UP</Text>
                                    )}
                                    {milestone.status === 'earned' && (
                                        <Text style={styles.earnedText}>● EARNED</Text>
                                    )}
                                    {milestone.status === 'locked' && (
                                        <Text style={styles.lockedText}>Final Boss</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Milestone Rewards */}
                <Text style={styles.sectionTitle}>Milestone Rewards</Text>

                <View style={styles.rewardsGrid}>
                    {REWARDS.map((reward) => (
                        <View key={reward.id} style={styles.rewardCard}>
                            <View style={[styles.rewardIconBox, { backgroundColor: reward.color + '15' }]}>
                                <Ionicons name={reward.icon as any} size={32} color={reward.color} />
                            </View>
                            <Text style={styles.rewardTitle}>{reward.title}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Add Button */}
            <View style={styles.bottomContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        { transform: [{ scale: pressed ? 0.98 : 1 }] }
                    ]}
                    onPress={handleAddSavings}
                >
                    <Ionicons name="add-circle" size={24} color="white" />
                    <Text style={styles.addButtonText}>ADD SAVINGS</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: 'white',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    helpButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    goalCard: {
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 28,
        marginTop: 20,
        marginBottom: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
        position: 'relative',
    },
    levelBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#FFE5A3',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
    },
    levelText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#FF9600',
        letterSpacing: 1,
    },
    bikeIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF8E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    goalTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    goalSubtitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    activeBadge: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        marginBottom: 20,
    },
    activeBadgeText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 1,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    currentAmount: {
        fontSize: 36,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    goalAmountText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#8B8B8B',
        marginLeft: 6,
    },
    percentBadge: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 16,
    },
    percentText: {
        fontSize: 14,
        fontWeight: '900',
        color: 'white',
    },
    progressTrack: {
        width: '100%',
        height: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFB800',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 6,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B8B8B',
        marginBottom: 20,
    },
    milestonesContainer: {
        marginBottom: 32,
    },
    milestoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 14,
    },
    milestoneIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    milestoneIconLocked: {
        backgroundColor: '#E0E0E0',
    },
    milestoneIconNext: {
        backgroundColor: '#FFB800',
    },
    milestoneIconEarned: {
        backgroundColor: '#46A302',
    },
    milestoneCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    milestoneCardNext: {
        borderWidth: 2,
        borderColor: '#FFB800',
        backgroundColor: '#FFF9E6',
    },
    milestoneContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    milestoneAmount: {
        fontSize: 15,
        fontWeight: '900',
        color: '#1F1F1F',
        flex: 1,
    },
    milestoneStatus: {
        fontSize: 11,
        fontWeight: '900',
        color: '#FFB800',
        letterSpacing: 1,
    },
    earnedText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#46A302',
        letterSpacing: 1,
    },
    lockedText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    rewardsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    rewardCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    rewardIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    rewardTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    addButton: {
        backgroundColor: '#FFB800',
        borderRadius: 28,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    addButtonText: {
        fontSize: 17,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 1,
    },
});
