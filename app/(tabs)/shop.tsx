import { GameCard } from '@/components/ui/game-card';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SPEND_ITEMS = [
    {
        id: 'food1',
        name: 'Gourmet Burger',
        desc: 'Delicious & Filling',
        price: 45,
        moodBoost: 15,
        icon: 'fast-food',
        color: '#FF6B35',
        category: 'Food'
    },
    {
        id: 'food2',
        name: 'Iced Coffee',
        desc: 'Instant Energy Boost',
        price: 25,
        moodBoost: 8,
        icon: 'cafe',
        color: '#8B4513',
        category: 'Drinks'
    },
    {
        id: 'ent1',
        name: 'Movie Night',
        desc: 'Top-rated Blockbuster',
        price: 120,
        moodBoost: 35,
        icon: 'film',
        color: '#1CB0F6',
        category: 'Entertainment'
    },
    {
        id: 'ent2',
        name: 'Concert Ticket',
        desc: 'Front row experience',
        price: 350,
        moodBoost: 60,
        icon: 'musical-notes',
        color: '#A5F84D',
        category: 'Entertainment'
    },
];

export default function ShopScreen() {
    const { gameState, updatePlayerStats, updatePlayerMoney } = useGame();
    const { player } = gameState;

    const handlePurchase = (item: typeof SPEND_ITEMS[0]) => {
        if (player.money < item.price) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Not enough money", "You need to save more before you can spend on this!");
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Deduct money
        updatePlayerMoney(-item.price, 'spend', `Purchased ${item.name}`);

        // Boost mood
        const newMood = Math.min(100, player.mood + item.moodBoost);
        updatePlayerStats({ mood: newMood });

        Alert.alert("Purchase Successful!", `Your mood increased by ${item.moodBoost}%! Current mood: ${newMood}%`);
    };

    return (
        <ScreenWrapper>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
                <StatusBar style="dark" />

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={{ height: 10 }} />

                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerSubtitle}>BALANCE THE FUN</Text>
                            <Text style={styles.headerTitle}>Life Store</Text>
                        </View>
                        <View style={styles.moodIndicator}>
                            <Ionicons name="happy" size={24} color="#58CC02" />
                            <Text style={styles.moodValue}>{player.mood}%</Text>
                        </View>
                    </View>

                    {/* Offer Banner */}
                    <View style={styles.bannerContainer}>
                        <LinearGradient
                            colors={['#A5F84D', '#58CC02']}
                            style={styles.bannerGradient}
                        >
                            <View style={styles.bannerIconBox}>
                                <Ionicons name="sparkles" size={32} color="white" />
                            </View>
                            <View style={styles.bannerTextContent}>
                                <Text style={styles.bannerLabel}>TREAT YOURSELF!</Text>
                                <Text style={styles.bannerSubtext}>High mood helps you earn XP faster.</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Spend Items Grid */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Choices</Text>
                    </View>

                    <View style={styles.grid}>
                        {SPEND_ITEMS.map((item) => (
                            <View key={item.id} style={styles.gridItem}>
                                <GameCard style={styles.itemCard}>
                                    <View style={[styles.categoryBadge, { backgroundColor: item.color + '20' }]}>
                                        <Text style={[styles.categoryText, { color: item.color }]}>{item.category}</Text>
                                    </View>

                                    <View style={styles.iconContainer}>
                                        <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                                            <Ionicons name={item.icon as any} size={36} color={item.color} />
                                        </View>
                                    </View>

                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemDesc}>{item.desc}</Text>

                                    <View style={styles.moodBenefit}>
                                        <Ionicons name="heart" size={12} color="#FF4B4B" />
                                        <Text style={styles.moodBenefitText}>+{item.moodBoost}% Mood</Text>
                                    </View>

                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.buyBtn,
                                            { backgroundColor: item.color, transform: [{ scale: pressed ? 0.94 : 1 }] }
                                        ]}
                                        onPress={() => handlePurchase(item)}
                                    >
                                        <Text style={styles.buyBtnText}>₹{item.price}</Text>
                                    </Pressable>
                                </GameCard>
                            </View>
                        ))}
                    </View>

                    <View style={styles.tipBox}>
                        <Ionicons name="bulb" size={20} color="#FFD600" />
                        <Text style={styles.tipText}>Tip: Don't spend all your savings at once! Balance is key to winning.</Text>
                    </View>

                    <View style={styles.bottomSpacing} />
                </ScrollView>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 1.5,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    moodIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    moodValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    bannerContainer: {
        borderRadius: 32,
        overflow: 'hidden',
        borderBottomWidth: 6,
        borderColor: '#46A302',
        marginBottom: 32,
    },
    bannerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
    bannerIconBox: {
        width: 60,
        height: 60,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.25)',
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
        letterSpacing: 0.5,
    },
    bannerSubtext: {
        fontSize: 12,
        fontWeight: '700',
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
    itemCard: {
        padding: 16,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 4,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 72,
        height: 72,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
        textAlign: 'center',
    },
    itemDesc: {
        fontSize: 11,
        fontWeight: '600',
        color: '#8B8B8B',
        marginBottom: 12,
        textAlign: 'center',
    },
    moodBenefit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginBottom: 16,
        backgroundColor: '#FFF5F5',
        paddingVertical: 4,
        borderRadius: 8,
    },
    moodBenefitText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#FF4B4B',
    },
    buyBtn: {
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderColor: 'rgba(0,0,0,0.15)',
    },
    buyBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    tipBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFBE6',
        borderRadius: 24,
        marginTop: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: '#FFF1B8',
    },
    tipText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        color: '#856404',
        lineHeight: 18,
    },
    bottomSpacing: {
        height: 120,
    },
});
