import { GameCard } from '@/components/ui/game-card';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const NEED_HELP = [
    { id: '1', name: 'Leo', amount: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Leo' },
    { id: '2', name: 'Chloe', amount: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Chloe', badge: true },
    { id: '3', name: 'Jordan', amount: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Jordan' },
];

export default function SocialScreen() {
    const { gameState } = useGame();
    const { player } = gameState;
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            <StatusBar style="dark" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={{ height: 10 }} />

                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Social Hub</Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.addFriendBtn,
                            { transform: [{ scale: pressed ? 0.92 : 1 }] }
                        ]}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    >
                        <Ionicons name="person-add" size={20} color="#1F1F1F" />
                    </Pressable>
                </View>

                {/* Karma Score Card */}
                <LinearGradient
                    colors={['#FFB800', '#FF9600']}
                    style={styles.karmaCard}
                >
                    <View style={styles.karmaHeader}>
                        <View>
                            <Text style={styles.karmaLabel}>KARMA SCORE</Text>
                            <Text style={styles.karmaValue}>850</Text>
                        </View>
                        <View style={styles.karmaTrend}>
                            <Ionicons name="trending-up" size={16} color="#46A302" />
                            <Text style={styles.karmaTrendText}>+25 this week</Text>
                        </View>
                    </View>

                    <View style={styles.karmaTrack}>
                        <View style={[styles.karmaFill, { width: '85%' }]} />
                    </View>

                    <View style={styles.karmaBottom}>
                        <Text style={styles.karmaLevel}>Level 5: Generous Giant</Text>
                        <Text style={styles.karmaNext}>Next: 1000</Text>
                    </View>

                    <Ionicons name="star" size={120} color="rgba(255,255,255,0.1)" style={styles.karmaBgIcon} />
                </LinearGradient>

                {/* Who needs a hand? */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Who needs a hand?</Text>
                    <Pressable><Text style={styles.viewAllText}>View all</Text></Pressable>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.friendsHorizontal}
                    contentContainerStyle={styles.friendsContent}
                >
                    {NEED_HELP.map((friend) => (
                        <Pressable
                            key={friend.id}
                            style={styles.friendItem}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push('/send-cash');
                            }}
                        >
                            <View style={styles.friendAvatarBox}>
                                <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                                <View style={styles.reqAmountBadge}>
                                    <Text style={styles.reqAmountText}>₹{friend.amount}</Text>
                                </View>
                            </View>
                            <Text style={styles.friendName}>{friend.name}</Text>
                        </Pressable>
                    ))}
                    <Pressable style={styles.inviteBtn}>
                        <View style={styles.inviteIconBox}>
                            <Ionicons name="add" size={32} color="#AFAFAF" />
                        </View>
                        <Text style={styles.inviteText}>Invite</Text>
                    </Pressable>
                </ScrollView>

                {/* Active Loans */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Loans</Text>
                </View>

                {[
                    { id: 'l1', to: 'Maya', amount: 15, tag: 'PIZZA', tagColor: '#FF6B35', progress: 40, time: '2d left' },
                    { id: 'l2', to: 'Sam', amount: 5, tag: 'BUS FARE', tagColor: '#CE82FF', progress: 80, time: 'Due today' },
                ].map((loan, idx) => (
                    <GameCard key={loan.id} style={styles.loanCard}>
                        <View style={styles.loanTop}>
                            <View style={styles.loanAvatarContainer}>
                                <Image
                                    source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${loan.to}` }}
                                    style={styles.loanAvatar}
                                />
                            </View>
                            <View style={styles.loanInfo}>
                                <Text style={styles.loanTitle}>Lent ₹{loan.amount}</Text>
                                <Text style={styles.loanSub}>to {loan.to}</Text>
                            </View>
                            <View style={[styles.loanTag, { backgroundColor: loan.tagColor + '20' }]}>
                                <Text style={[styles.loanTagText, { color: loan.tagColor }]}>{loan.tag}</Text>
                            </View>
                        </View>

                        <View style={styles.loanProgressRow}>
                            <View style={[styles.loanTrack, { flex: 1 }]}>
                                <View style={[styles.loanFill, { width: `${loan.progress}%`, backgroundColor: loan.progress > 70 ? '#B8FF66' : '#1CB0F6' }]} />
                            </View>
                            <Text style={styles.loanTime}>{loan.time}</Text>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.pokeBtn,
                                { transform: [{ scale: pressed ? 0.96 : 1 }] }
                            ]}
                            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                        >
                            <Ionicons name="hand-right" size={20} color="#1CB0F6" />
                            <Text style={styles.pokeBtnText}>Friendly Poke</Text>
                        </Pressable>
                    </GameCard>
                ))}

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Ask For Help FAB */}
            <Pressable
                style={({ pressed }) => [
                    styles.fab,
                    { transform: [{ scale: pressed ? 0.9 : 1 }] }
                ]}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/ask-help');
                }}
            >
                <View style={[styles.fabBorder, { backgroundColor: '#B8FF66' }]}>
                    <View style={styles.fabIconRow}>
                        <Ionicons name="hand-left" size={24} color="#1F1F1F" />
                        <Text style={styles.fabText}>ASK FOR HELP</Text>
                    </View>
                </View>
            </Pressable>
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    addFriendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    karmaCard: {
        padding: 24,
        borderRadius: 32,
        marginBottom: 32,
        overflow: 'hidden',
    },
    karmaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    karmaLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(0,0,0,0.4)',
        letterSpacing: 1,
        marginBottom: 4,
    },
    karmaValue: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    karmaTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    karmaTrendText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#46A302',
    },
    karmaTrack: {
        height: 14,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 7,
        marginBottom: 16,
    },
    karmaFill: {
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 7,
    },
    karmaBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    karmaLevel: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(0,0,0,0.5)',
    },
    karmaNext: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(0,0,0,0.4)',
    },
    karmaBgIcon: {
        position: 'absolute',
        right: -20,
        top: -10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1CB0F6',
    },
    friendsHorizontal: {
        marginHorizontal: -20,
        marginBottom: 32,
    },
    friendsContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    friendItem: {
        alignItems: 'center',
        gap: 8,
    },
    friendAvatarBox: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    reqAmountBadge: {
        position: 'absolute',
        bottom: -6,
        backgroundColor: '#1CB0F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'white',
    },
    reqAmountText: {
        fontSize: 11,
        fontWeight: '900',
        color: 'white',
    },
    friendName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    inviteBtn: {
        alignItems: 'center',
        gap: 8,
    },
    inviteIconBox: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2,
        borderColor: '#AFAFAF',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inviteText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#AFAFAF',
    },
    loanCard: {
        padding: 24,
        marginBottom: 16,
        borderRadius: 32,
        borderBottomWidth: 6,
        borderColor: '#F0F0F0',
    },
    loanTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    loanAvatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        marginRight: 16,
    },
    loanAvatar: {
        width: '100%',
        height: '100%',
    },
    loanInfo: {
        flex: 1,
    },
    loanTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    loanSub: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    loanTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    loanTagText: {
        fontSize: 12,
        fontWeight: '900',
    },
    loanProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    loanTrack: {
        height: 12,
        backgroundColor: '#F0F0F0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    loanFill: {
        height: '100%',
        borderRadius: 6,
    },
    loanTime: {
        fontSize: 12,
        fontWeight: '900',
        color: '#8B8B8B',
    },
    pokeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E6F4FF',
        paddingVertical: 14,
        borderRadius: 20,
        gap: 8,
        borderBottomWidth: 4,
        borderColor: 'rgba(28,176,246,0.2)',
    },
    pokeBtnText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1CB0F6',
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        shadowColor: '#1CB0F6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    fabBorder: {
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 32,
        borderBottomWidth: 8,
        borderColor: '#46A302',
    },
    fabIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fabText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
        letterSpacing: 1,
    },
    bottomSpacing: {
        height: 160,
    },
});
