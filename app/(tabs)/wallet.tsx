import { GameCard } from '@/components/ui/game-card';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TRANSACTIONS = [
    { id: '1', name: 'Coffee House', category: 'Leisure', amount: -15, time: '2h ago', icon: 'cafe', color: '#FFB800' },
    { id: '2', name: 'Salary Deposit', category: 'Income', amount: 500, time: '6h ago', icon: 'cash', color: '#46A302' },
    { id: '3', name: 'Utility Bill', category: 'Bills', amount: -120, time: 'Yesterday', icon: 'flash', color: '#1CB0F6' },
];

export default function WalletScreen() {
    const { gameState } = useGame();
    const { player } = gameState;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            <StatusBar style="dark" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={{ height: 10 }} />

                <Text style={styles.headerTitle}>Finance Central</Text>

                {/* Main Balance Card */}
                <LinearGradient
                    colors={['#1F1F1F', '#3F3F3F']}
                    style={styles.balanceGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.balanceHeader}>
                        <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
                        <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                            <Ionicons name="eye-outline" size={24} color="rgba(255,255,255,0.6)" />
                        </Pressable>
                    </View>
                    <Text style={styles.balanceAmount}>₹{player.money.toLocaleString('en-IN')}</Text>
                    <View style={styles.cardFooter}>
                        <View style={styles.cardNumber}>
                            <View style={styles.cardDot} />
                            <View style={styles.cardDot} />
                            <View style={styles.cardDot} />
                            <Text style={styles.cardNumberText}>1234</Text>
                        </View>
                        <Ionicons name="card" size={32} color="white" />
                    </View>
                    <Ionicons name="wallet-outline" size={160} color="rgba(255,255,255,0.05)" style={styles.bgIcon} />
                </LinearGradient>

                {/* Quick Stats */}
                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: '#F0FFF4' }]}>
                        <View style={[styles.statIconBox, { backgroundColor: '#B8FF66' }]}>
                            <Image source={require('@/assets/game/income.png')} style={styles.statImage} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>Income</Text>
                            <Text style={[styles.statValue, { color: '#46A302' }]}>+₹850</Text>
                            <View style={styles.statTrend}>
                                <Ionicons name="caret-up" size={10} color="#46A302" />
                                <Text style={styles.statPct}>12%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: '#FFF5F5' }]}>
                        <View style={[styles.statIconBox, { backgroundColor: '#FFDEDE' }]}>
                            <Image source={require('@/assets/game/spent.png')} style={styles.statImage} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>Spent</Text>
                            <Text style={[styles.statValue, { color: '#FF4B4B' }]}>-₹320</Text>
                            <View style={styles.statTrend}>
                                <Ionicons name="caret-down" size={10} color="#FF4B4B" />
                                <Text style={[styles.statPct, { color: '#FF4B4B' }]}>5%</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Monthly Budget */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Monthly Budget</Text>
                    <Pressable><Text style={styles.seeAllText}>Manage</Text></Pressable>
                </View>
                <GameCard style={styles.budgetCard}>
                    <View style={styles.budgetTop}>
                        <View>
                            <Text style={styles.budgetName}>Survival Necessities</Text>
                            <Text style={styles.budgetStatus}>75% of monthly limit used</Text>
                        </View>
                        <Text style={styles.budgetAmountText}>₹450 / <Text style={{ color: '#1F1F1F' }}>₹600</Text></Text>
                    </View>
                    <View style={styles.budgetTrack}>
                        <LinearGradient
                            colors={['#FFB800', '#FF8800']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.budgetFill, { width: '75%' }]}
                        />
                    </View>
                    <View style={styles.warningContainer}>
                        <View style={styles.warningIconCircle}>
                            <Ionicons name="alert" size={14} color="white" />
                        </View>
                        <Text style={styles.budgetWarning}>You've spent 90% of your utilities budget</Text>
                    </View>
                </GameCard>

                {/* Recent Transactions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent activity</Text>
                    <Pressable><Text style={styles.seeAllText}>History</Text></Pressable>
                </View>

                {TRANSACTIONS.map((tx) => (
                    <Pressable key={tx.id} style={styles.txItem}>
                        <View style={[styles.txIconBox, { backgroundColor: tx.color + '15' }]}>
                            <Ionicons name={tx.icon as any} size={24} color={tx.color} />
                        </View>
                        <View style={styles.txInfo}>
                            <Text style={styles.txName}>{tx.name}</Text>
                            <Text style={styles.txCategory}>{tx.category}</Text>
                        </View>
                        <View style={styles.txAmountCont}>
                            <Text style={[styles.txAmount, { color: tx.amount > 0 ? '#46A302' : '#1F1F1F' }]}>
                                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                            </Text>
                            <Text style={styles.txTime}>{tx.time}</Text>
                        </View>
                    </Pressable>
                ))}

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBFF',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 16,
    },
    balanceCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 0,
        marginBottom: 24,
    },
    balanceGradient: {
        borderRadius: 32,
        padding: 24,
        height: 185,
        justifyContent: 'space-between',
        marginBottom: 32,
        borderBottomWidth: 8,
        borderColor: '#000000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 14,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 2,
    },
    balanceAmount: {
        fontSize: 48,
        fontWeight: '900',
        color: 'white',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardNumber: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    cardNumberText: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 3,
        marginLeft: 6,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        padding: 12,
        borderRadius: 24,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    statIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '900',
        color: '#8B8B8B',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '900',
    },
    statTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    statPct: {
        fontSize: 10,
        fontWeight: '900',
        color: '#46A302',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1CB0F6',
    },
    budgetCard: {
        padding: 18,
        marginBottom: 24,
        borderRadius: 28,
    },
    budgetTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    budgetName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    budgetAmountText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    budgetTrack: {
        height: 14,
        backgroundColor: '#F0F0F0',
        borderRadius: 7,
        overflow: 'hidden',
        marginBottom: 16,
    },
    budgetFill: {
        height: '100%',
        backgroundColor: '#FFB800',
        borderRadius: 7,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    budgetStatus: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B8B8B',
        marginTop: 2,
    },
    warningIconCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FF4B4B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    budgetWarning: {
        fontSize: 13,
        fontWeight: '900',
        color: '#FF4B4B',
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 8,
    },
    txIconBox: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    txInfo: {
        flex: 1,
    },
    txName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    txCategory: {
        fontSize: 14,
        fontWeight: '700',
        color: '#AFAFAF',
    },
    txAmountCont: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 18,
        fontWeight: '900',
    },
    txTime: {
        fontSize: 12,
        fontWeight: '600',
        color: '#AFAFAF',
    },
    bottomSpacing: {
        height: 120,
    },
    bgIcon: {
        position: 'absolute',
        right: -30,
        bottom: -40,
        opacity: 0.1,
    },
});
