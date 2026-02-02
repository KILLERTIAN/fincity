import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Dummy Stock Data
const MISSIONS = [
    {
        id: 'tech',
        name: 'Tech Rocket',
        icon: 'hardware-chip',
        color: '#1CB0F6',
        bgColor: '#D8E5FF',
        change: 12.4,
        price: 15.20,
        trend: [10, 12, 11, 14, 13, 15, 16, 15, 18, 17, 20]
    },
    {
        id: 'energy',
        name: 'Energy Shield',
        icon: 'leaf',
        color: '#46A302',
        bgColor: '#E6F7D6',
        change: 4.2,
        price: 8.50,
        trend: [8, 8.2, 8.1, 8.5, 8.4, 8.8, 8.9, 9.0, 9.2, 9.1, 9.3]
    },
    {
        id: 'toy',
        name: 'Toy Factory',
        icon: 'happy',
        color: '#FF4B4B',
        bgColor: '#FFE1E9',
        change: -2.1,
        price: 5.40,
        trend: [6, 5.8, 5.9, 5.5, 5.7, 5.4, 5.2, 5.3, 5.0, 5.1, 4.9]
    },
];

// Simple Sparkline Component
const Sparkline = ({ data, color, width = 60, height = 30 }: { data: number[], color: string, width?: number, height?: number }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    // Normalize data to points
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <Svg width={width} height={height}>
            <Path
                d={`M ${points}`}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default function InvestScreen() {
    const router = useRouter();
    const { gameState } = useGame();
    const { player } = gameState;

    const handleInvest = (missionId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // TODO: Implement investment logic
    };

    return (
        <View style={styles.container}>
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
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerSup}>MISSION CONTROL</Text>
                        <Text style={styles.headerTitle}>Invest Zone</Text>
                    </View>
                    <View style={styles.coinPill}>
                        <View style={styles.coinIcon}>
                            <Ionicons name="logo-bitcoin" size={14} color="#FF9600" />
                        </View>
                        <Text style={styles.coinText}>{player.money.toLocaleString()}</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                    {/* Hero Card */}
                    <View style={styles.heroCard}>
                        {/* Stars Background */}
                        <View style={styles.starBg}>
                            {[...Array(10)].map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        top: Math.random() * 180,
                                        left: Math.random() * (width - 40),
                                        width: Math.random() * 3 + 1,
                                        height: Math.random() * 3 + 1,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                    }}
                                />
                            ))}
                        </View>

                        <View style={styles.heroIconBox}>
                            <Ionicons name="rocket" size={32} color="white" />
                        </View>

                        <Text style={styles.heroLabel}>AVAILABLE TO INVEST</Text>
                        <Text style={styles.heroAmount}>${(player.money * 0.4).toFixed(2)}</Text>
                    </View>

                    {/* Missions List */}
                    <Text style={styles.sectionTitle}>Select Your Mission</Text>

                    <View style={styles.missionList}>
                        {MISSIONS.map((mission) => (
                            <Pressable
                                key={mission.id}
                                style={({ pressed }) => [styles.missionCard, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            >
                                <View style={[styles.missionIconBox, { backgroundColor: mission.bgColor }]}>
                                    <Ionicons name={mission.icon as any} size={28} color={mission.color} />
                                </View>

                                <View style={styles.missionInfo}>
                                    <Text style={styles.missionName}>{mission.name}</Text>
                                    <View style={styles.missionStats}>
                                        <Sparkline
                                            data={mission.trend}
                                            color={mission.change >= 0 ? '#00C853' : '#FF5252'}
                                        />
                                        <Text style={[styles.missionChange, { color: mission.change >= 0 ? '#00C853' : '#FF5252' }]}>
                                            <Ionicons name={mission.change >= 0 ? 'trending-up' : 'trending-down'} size={12} />
                                            {' '}{Math.abs(mission.change)}%
                                        </Text>
                                    </View>
                                </View>

                                <Pressable
                                    style={({ pressed }) => [
                                        styles.investPlusBtn,
                                        {
                                            backgroundColor: mission.change >= 0 ? mission.color : '#FF4B4B',
                                            transform: [{ scale: pressed ? 0.9 : 1 }]
                                        }
                                    ]}
                                    onPress={() => handleInvest(mission.id)}
                                >
                                    <Ionicons name="add" size={24} color="white" />
                                </Pressable>
                            </Pressable>
                        ))}
                    </View>

                    {/* Tip Card */}
                    <View style={styles.tipCard}>
                        <View style={styles.tipIcon}>
                            <Ionicons name="bulb" size={20} color="#F59E0B" />
                        </View>
                        <Text style={styles.tipText}>
                            Investing means putting your money into a business. If the business grows, your money grows too! Remember: diversify like a pro!
                        </Text>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom Button */}
                <View style={styles.bottomContainer}>
                    <Pressable
                        style={({ pressed }) => [styles.launchBtn, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            // Launch investing flow
                        }}
                    >
                        <Ionicons name="rocket-outline" size={24} color="#1F1F1F" style={{ marginRight: 8 }} />
                        <Text style={styles.launchBtnText}>LAUNCH INVESTMENT</Text>
                    </Pressable>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
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
        marginBottom: 10,
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
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerSup: {
        fontSize: 10,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 1,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    coinPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    coinIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF4E6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    coinText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    heroCard: {
        backgroundColor: '#2D2B75',
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#2D2B75',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    starBg: {
        ...StyleSheet.absoluteFillObject,
    },
    heroIconBox: {
        marginBottom: 16,
    },
    heroLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 2,
        marginBottom: 8,
    },
    heroAmount: {
        fontSize: 48,
        fontWeight: '900',
        color: 'white',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 20,
    },
    missionList: {
        gap: 16,
        marginBottom: 32,
    },
    missionCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    missionIconBox: {
        width: 64,
        height: 64,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    missionInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    missionName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 8,
    },
    missionStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    missionChange: {
        fontSize: 13,
        fontWeight: '900',
    },
    investPlusBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    tipCard: {
        backgroundColor: '#FFF3D6',
        borderRadius: 24,
        padding: 20,
        borderWidth: 2,
        borderColor: '#FFE0A3',
        flexDirection: 'row',
        gap: 12,
    },
    tipIcon: {
        marginTop: 2,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#8B6914',
        lineHeight: 20,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        padding: 24,
    },
    launchBtn: {
        backgroundColor: '#B2F35F',
        borderRadius: 32,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#B2F35F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 2,
        borderColor: '#9EE04F',
    },
    launchBtnText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
        letterSpacing: 1,
    },
});
