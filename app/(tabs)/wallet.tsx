import { CustomPopup } from '@/components/ui/CustomPopup';
import { GameCard } from '@/components/ui/game-card';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Static transactions removed - using real data from GameContext

export default function WalletScreen() {
    const { gameState, repayLoan } = useGame();
    const { player, transactions, loans } = gameState;

    // Active loans where player is the borrower
    const activeDebts = loans.filter(l => l.borrowerId === player.id && l.status === 'active');

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupData, setPopupData] = useState<{
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
    }>({ type: 'info', title: '', message: '' });

    const showPopup = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setPopupData({ type, title, message });
        setPopupVisible(true);
    };

    // Calculate real stats
    const incomeTotal = transactions
        .filter(t => t.type === 'earn')
        .reduce((sum, t) => sum + t.amount, 0);

    const spentTotal = transactions
        .filter(t => t.type === 'spend')
        .reduce((sum, t) => sum + t.amount, 0);

    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diffInMs = now.getTime() - new Date(date).getTime();
        const diffInMins = Math.floor(diffInMs / (1000 * 60));

        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`;
        return 'Yesterday';
    };

    const getTxIcon = (desc: string) => {
        const d = desc.toLowerCase();
        if (d.includes('coffee')) return 'cafe';
        if (d.includes('salary') || d.includes('money')) return 'cash';
        if (d.includes('bill')) return 'flash';
        if (d.includes('bought') || d.includes('sold')) return 'trending-up';
        return 'cart';
    };

    const getTxColor = (desc: string) => {
        const d = desc.toLowerCase();
        if (d.includes('coffee')) return '#FFB800';
        if (d.includes('bill')) return '#1CB0F6';
        if (d.includes('bought')) return '#46A302';
        if (d.includes('sold')) return '#FF4B4B';
        return '#8B8B8B';
    };

    return (
        <ScreenWrapper>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
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
                        <Text style={styles.balanceAmount}>₹{player.money.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</Text>
                        <View style={styles.cardFooter}>
                            <View style={styles.cardNumber}>
                                <View style={styles.cardDot} />
                                <View style={styles.cardDot} />
                                <View style={styles.cardDot} />
                                <Text style={styles.cardNumberText}>1234</Text>
                            </View>
                            <Ionicons name="card" size={32} color="white" />
                        </View>
                        <Ionicons name="wallet-outline" size={160} color="rgba(255,255,255,0.05)" style={{ position: 'absolute', right: -30, bottom: -40 }} />
                    </LinearGradient>

                    {/* Quick Stats */}
                    <View style={styles.statsRow}>
                        <View style={[styles.statBox, { backgroundColor: '#F0FFF4' }]}>
                            <View style={[styles.statIconBox, { backgroundColor: '#B8FF66' }]}>
                                <Image source={require('@/assets/game/income.png')} style={styles.statImage} />
                            </View>
                            <View style={styles.statContent}>
                                <Text style={styles.statLabel}>Income</Text>
                                <Text style={[styles.statValue, { color: '#46A302' }]}>+₹{incomeTotal.toFixed(0)}</Text>
                                <View style={styles.statTrend}>
                                    <Ionicons name="caret-up" size={10} color="#46A302" />
                                    <Text style={styles.statPct}>Auto</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: '#FFF5F5' }]}>
                            <View style={[styles.statIconBox, { backgroundColor: '#FFDEDE' }]}>
                                <Image source={require('@/assets/game/spent.png')} style={styles.statImage} />
                            </View>
                            <View style={styles.statContent}>
                                <Text style={styles.statLabel}>Spent</Text>
                                <Text style={[styles.statValue, { color: '#FF4B4B' }]}>-₹{spentTotal.toFixed(0)}</Text>
                                <View style={styles.statTrend}>
                                    <Ionicons name="caret-down" size={10} color="#FF4B4B" />
                                    <Text style={[styles.statPct, { color: '#FF4B4B' }]}>Live</Text>
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

                    {/* My Debts (New Section) */}
                    {activeDebts.length > 0 && (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>My Debts</Text>
                                <Text style={[styles.seeAllText, { color: '#FF4B4B' }]}>{activeDebts.length} Pending</Text>
                            </View>
                            {activeDebts.map(loan => (
                                <GameCard key={loan.id} style={[styles.debtCard, { borderColor: '#FF4B4B20', borderWidth: 1 }]}>
                                    <View style={styles.debtInfo}>
                                        <View style={styles.debtIconBox}>
                                            <Ionicons name="time" size={20} color="#FF4B4B" />
                                        </View>
                                        <View>
                                            <Text style={styles.debtAmount}>₹{loan.repaymentAmount.toFixed(2)}</Text>
                                            <Text style={styles.debtDue}>Due in 3 days</Text>
                                        </View>
                                    </View>
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.repayBtn,
                                            { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                        ]}
                                        onPress={() => {
                                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                            repayLoan(loan.id);
                                            showPopup("success", "Debt Repaid", `You've successfully repaid ₹${loan.repaymentAmount.toFixed(2)}. Your Trust Score just went up!`);
                                        }}
                                    >
                                        <Text style={styles.repayBtnText}>PAY BACK</Text>
                                    </Pressable>
                                </GameCard>
                            ))}
                            <View style={{ height: 16 }} />
                        </>
                    )}

                    {/* Recent Transactions */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent activity</Text>
                        <Pressable><Text style={styles.seeAllText}>History</Text></Pressable>
                    </View>

                    {transactions.length === 0 ? (
                        <View style={styles.emptyActivity}>
                            <Ionicons name="receipt-outline" size={48} color="#D0D0D0" />
                            <Text style={styles.emptyText}>No recent activity yet</Text>
                        </View>
                    ) : (
                        transactions.slice(0, 5).map((tx) => (
                            <Pressable key={tx.id} style={styles.txItem}>
                                <View style={[styles.txIconBox, { backgroundColor: getTxColor(tx.description) + '15' }]}>
                                    <Ionicons name={getTxIcon(tx.description) as any} size={24} color={getTxColor(tx.description)} />
                                </View>
                                <View style={styles.txInfo}>
                                    <Text style={styles.txName}>{tx.description}</Text>
                                    <Text style={styles.txCategory}>{tx.type === 'earn' ? 'Income' : 'Spending'}</Text>
                                </View>
                                <View style={styles.txAmountCont}>
                                    <Text style={[styles.txAmount, { color: tx.type === 'earn' ? '#46A302' : '#1F1F1F' }]}>
                                        {tx.type === 'earn' ? '+' : '-'}₹{Math.abs(tx.amount).toFixed(2)}
                                    </Text>
                                    <Text style={styles.txTime}>{getRelativeTime(tx.timestamp)}</Text>
                                </View>
                            </Pressable>
                        ))
                    )}

                    <View style={styles.bottomSpacing} />
                </ScrollView>

                <CustomPopup
                    visible={popupVisible}
                    onClose={() => setPopupVisible(false)}
                    type={popupData.type}
                    title={popupData.title}
                    message={popupData.message}
                />
            </SafeAreaView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F9EB',
    },
    safeArea: {
        flex: 1,
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
    emptyActivity: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'white',
        borderRadius: 24,
        marginTop: 10,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#D0D0D0',
        marginTop: 12,
    },
    debtCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 12,
        borderRadius: 24,
    },
    debtInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    debtIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFF5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    debtAmount: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    debtDue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FF4B4B',
    },
    repayBtn: {
        backgroundColor: '#FF4B4B',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
    },
    repayBtnText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'white',
    },
});
