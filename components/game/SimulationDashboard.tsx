import { GameCard } from '@/components/ui/game-card';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MoodMeter } from './MoodMeter';

const { width } = Dimensions.get('window');

interface SimulationDashboardProps {
    visible: boolean;
    onClose: () => void;
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ visible, onClose }) => {
    const { gameState, payBill } = useGame();
    const { player, bills } = gameState;
    const insets = useSafeAreaInsets();

    const unpaidBills = bills.filter(b => !b.isPaid);

    const handlePayBill = (bill: any) => {
        if (player.money < bill.amount) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        payBill(bill.id);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <StatusBar style="light" translucent />

                {/* Fixed Header Background (Immersive) */}
                <View style={[styles.immersiveHeader, { height: 280 + insets.top }]}>
                    <LinearGradient
                        colors={['#1CB0F6', '#5AA1F4']}
                        style={StyleSheet.absoluteFill}
                    />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
                >
                    {/* Header Controls */}
                    <View style={styles.headerRow}>
                        <Pressable onPress={onClose} style={styles.backButton}>
                            <Ionicons name="chevron-down" size={24} color="white" />
                        </Pressable>
                        <View style={styles.titleGroup}>
                            <Text style={styles.headerSubtitle}>SIMULATION MONTH</Text>
                            <Text style={styles.dayText}>Day {player.simulationDay} <Text style={styles.dayLabel}>/ 30</Text></Text>
                        </View>
                        <Pressable style={styles.pauseButton}>
                            <Ionicons name="pause" size={20} color="#1CB0F6" />
                        </Pressable>
                    </View>

                    {/* Survival Health Card */}
                    <View style={styles.healthCard}>
                        <View style={styles.healthHeader}>
                            <View style={styles.healthLabelRow}>
                                <Ionicons name="heart" size={20} color="#FF4B4B" />
                                <Text style={styles.healthLabel}>SURVIVAL HEALTH</Text>
                            </View>
                            <Text style={styles.healthValue}>{player.survivalHealth}%</Text>
                        </View>
                        <View style={styles.healthTrack}>
                            <View style={[styles.healthFill, { width: `${player.survivalHealth}%` }]} />
                        </View>
                    </View>

                    {/* Content Section (White background curve) */}
                    <View style={styles.contentArea}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Pending Bills</Text>
                            <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>{unpaidBills.length} TO PAY</Text>
                            </View>
                        </View>

                        {unpaidBills.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="checkmark-circle" size={48} color="#58CC02" />
                                <Text style={styles.emptyText}>All bills paid! Great job.</Text>
                            </View>
                        ) : (
                            unpaidBills.map((bill) => (
                                <GameCard key={bill.id} style={styles.billCard}>
                                    <View style={styles.billTop}>
                                        <View style={[styles.billIconBox, { backgroundColor: bill.color + '15' }]}>
                                            <Ionicons name={bill.icon as any} size={28} color={bill.color} />
                                        </View>
                                        <View style={styles.billInfo}>
                                            <View style={styles.billNameRow}>
                                                <Text style={styles.billName}>{bill.name}</Text>
                                                <Text style={styles.billPriceTag}>₹{bill.amount}</Text>
                                            </View>
                                            <Text style={styles.billDesc}>{bill.description}</Text>
                                            <View style={styles.dueRow}>
                                                <Ionicons name="calendar-outline" size={12} color="#8B8B8B" />
                                                <Text style={styles.dueText}>{bill.dueDate}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.payButton,
                                            { backgroundColor: bill.color, transform: [{ scale: pressed ? 0.98 : 1 }] }
                                        ]}
                                        onPress={() => handlePayBill(bill)}
                                    >
                                        <Text style={styles.payButtonText}>SETTLE BILL IN FULL</Text>
                                        <Ionicons name="arrow-forward" size={16} color="white" />
                                    </Pressable>
                                </GameCard>
                            ))
                        )}

                        <View style={styles.moodSection}>
                            <Text style={styles.sectionTitleSmall}>Current Vibe</Text>
                            <MoodMeter mood={player.mood} />
                        </View>

                        <View style={styles.bottomSpacing} />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

// Styles removed - see bottom of file

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    immersiveHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    scrollView: {
        flex: 1,
        zIndex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleGroup: {
        flex: 1,
        marginLeft: 16,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1.5,
    },
    dayText: {
        fontSize: 34,
        fontWeight: '900',
        color: 'white',
        marginTop: -2,
    },
    dayLabel: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.6)',
    },
    pauseButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    healthCard: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 28,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(10px)',
    } as any,
    healthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    healthLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    healthLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 0.5,
    },
    healthValue: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
    },
    healthTrack: {
        height: 10,
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    healthFill: {
        height: '100%',
        backgroundColor: '#FF4B4B',
        borderRadius: 5,
    },
    contentArea: {
        backgroundColor: '#F8FBFF',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingTop: 30,
        paddingHorizontal: 20,
        minHeight: 600,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    sectionTitleSmall: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    badgeContainer: {
        backgroundColor: '#EBF5FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#1CB0F6',
        letterSpacing: 0.5,
    },
    billCard: {
        padding: 20,
        borderRadius: 28,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    billTop: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    billIconBox: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    billInfo: {
        flex: 1,
    },
    billNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    billName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    billPriceTag: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    billDesc: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B8B8B',
        lineHeight: 18,
    },
    dueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
    },
    dueText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    payButton: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    payButtonText: {
        fontSize: 14,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 1,
    },
    moodSection: {
        marginTop: 40,
        marginBottom: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    bottomSpacing: {
        height: 60,
    },
});
