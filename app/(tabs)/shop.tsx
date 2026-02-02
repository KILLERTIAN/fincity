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

const GEM_PACKS = [
    { id: '1', name: 'Pile of Gems', amount: 100, price: '$0.99', popular: false },
    { id: '2', name: 'Bag of Gems', amount: 550, price: '$4.99', popular: true },
    { id: '3', name: 'Chest of Gems', amount: 1200, price: '$9.99', popular: false },
    { id: '4', name: 'Vault of Gems', amount: 2500, price: '$19.99', popular: false },
];

const DAILY_SPECIALS = [
    { id: 'd1', name: 'Lucky Magnet', desc: 'Attracts more high-yield investments', price: 250, icon: 'magnet', color: '#FF6B35' },
    { id: 'd2', name: 'Wisdom Scroll', desc: 'Instant 500 XP boost', price: 150, icon: 'receipt', color: '#1CB0F6' },
];

export default function ShopScreen() {
    const { gameState } = useGame();
    const { player } = gameState;

    const handlePurchase = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            <StatusBar style="dark" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={{ height: 10 }} />

                <Text style={styles.headerTitle}>Premium Store</Text>

                {/* Offer Banner */}
                <View style={styles.bannerContainer}>
                    <LinearGradient
                        colors={['#FF9D6C', '#FF6B35']}
                        style={styles.bannerGradient}
                    >
                        <View style={styles.bannerIconBox}>
                            <Ionicons name="gift" size={32} color="white" />
                        </View>
                        <View style={styles.bannerTextContent}>
                            <Text style={styles.bannerLabel}>LIMITED OFFER!</Text>
                            <Text style={styles.bannerSubtext}>Check out our daily special deals!</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Gem Packs */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Gem Packs</Text>
                </View>

                <View style={styles.grid}>
                    {GEM_PACKS.map((pack) => (
                        <View key={pack.id} style={styles.gridItem}>
                            <GameCard style={[styles.packCard, pack.popular && styles.popularCard]}>
                                {pack.popular && (
                                    <View style={styles.popularBadge}>
                                        <Text style={styles.popularText}>BEST VALUE</Text>
                                    </View>
                                )}
                                <View style={styles.packIconContainer}>
                                    <View style={styles.aetherCirc}>
                                        <Image
                                            source={require('@/assets/game/aether.png')}
                                            style={styles.aetherImg}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={styles.packAmount}>{pack.amount}</Text>
                                </View>
                                <Text style={styles.packName}>{pack.name}</Text>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.priceBtn,
                                        { transform: [{ scale: pressed ? 0.92 : 1 }] }
                                    ]}
                                    onPress={handlePurchase}
                                >
                                    <Text style={styles.priceBtnText}>{pack.price}</Text>
                                </Pressable>
                            </GameCard>
                        </View>
                    ))}
                </View>

                {/* Daily Specials */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Daily Special</Text>
                </View>

                {DAILY_SPECIALS.map((item) => (
                    <GameCard key={item.id} style={styles.specialCard}>
                        <View style={styles.specialTop}>
                            <View style={[styles.specialIconBox, { backgroundColor: item.color + '20' }]}>
                                <Ionicons name={item.icon as any} size={32} color={item.color} />
                            </View>
                            <View style={styles.specialInfo}>
                                <Text style={styles.specialName}>{item.name}</Text>
                                <Text style={styles.specialDesc}>{item.desc}</Text>
                            </View>
                        </View>
                        <Pressable
                            style={({ pressed }) => [
                                styles.specialBuyBtn,
                                { transform: [{ scale: pressed ? 0.96 : 1 }] }
                            ]}
                            onPress={handlePurchase}
                        >
                            <View>
                                <Text style={styles.buyLabel}>GET {item.name.toUpperCase()}</Text>
                            </View>
                            <View style={styles.specialPrice}>
                                <Text style={styles.specialPriceText}>{item.price}</Text>
                                <Image source={require('@/assets/game/aether.png')} style={styles.smallAether} />
                            </View>
                        </Pressable>
                    </GameCard>
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
        fontSize: 28,
        fontWeight: '900',
        color: '#1F1F1F',
        marginTop: 20,
        marginBottom: 20,
    },
    bannerContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        borderBottomWidth: 6,
        borderColor: '#E65100',
        marginBottom: 32,
    },
    bannerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    bannerIconBox: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    bannerTextContent: {
        flex: 1,
    },
    bannerLabel: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 1,
    },
    bannerSubtext: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
        opacity: 0.9,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 16,
    },
    sectionHeader: {
        marginTop: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    gridItem: {
        width: '50%',
        padding: 8,
    },
    packCard: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 8,
        borderRadius: 32,
        borderColor: '#F0F0F0',
    },
    popularCard: {
        borderColor: '#FFB800',
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        backgroundColor: '#FFB800',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 2,
    },
    popularText: {
        fontSize: 10,
        fontWeight: '900',
        color: 'white',
    },
    packIconContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    aetherCirc: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E6F4FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    aetherImg: {
        width: 40,
        height: 40,
    },
    packAmount: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    packName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B8B8B',
        marginBottom: 16,
        textAlign: 'center',
    },
    priceBtn: {
        backgroundColor: '#58CC02',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderBottomWidth: 4,
        borderColor: '#46A302',
    },
    priceBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    specialCard: {
        padding: 24,
        marginBottom: 16,
        borderBottomWidth: 8,
        borderRadius: 32,
        borderColor: '#F0F0F0',
    },
    specialTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    specialIconBox: {
        width: 64,
        height: 64,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    specialInfo: {
        flex: 1,
    },
    specialName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    specialDesc: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    specialBuyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1CB0F6',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderBottomWidth: 4,
        borderColor: '#179AD9',
    },
    buyLabel: {
        fontSize: 13,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 0.5,
    },
    specialPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    specialPriceText: {
        fontSize: 20,
        fontWeight: '900',
        color: 'white',
    },
    smallAether: {
        width: 18,
        height: 18,
    },
    bottomSpacing: {
        height: 120,
    },
});
