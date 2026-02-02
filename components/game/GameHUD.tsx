import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const GameHUD: React.FC = () => {
    const { gameState } = useGame();
    const { player } = gameState;
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const xpPercentage = (player.xp / player.requiredXP) * 100;

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top + 10 }]}>
            {/* Top row: Level, Coins, Gems */}
            <View style={styles.topRow}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>LEVEL {player.level}</Text>
                </View>

                <View style={styles.currencyRow}>
                    <View style={styles.chip}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFD700' }]}>
                            <Text style={styles.rupeeIcon}>₹</Text>
                        </View>
                        <Text style={styles.chipText}>{Math.floor(player.money).toLocaleString('en-IN')}</Text>
                    </View>

                    <Pressable
                        style={styles.chip}
                        onPress={() => router.push('/shop')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#1CB0F6' }]}>
                            <Image
                                source={require('@/assets/game/aether.png')}
                                style={styles.aetherIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.chipText}>{player.gems}</Text>
                    </Pressable>
                </View>
            </View>

            {/* Bottom row: XP Bar */}
            <View style={styles.xpContainer}>
                <View style={styles.xpBarTrack}>
                    <View style={[styles.xpBarFill, { width: `${xpPercentage}%` }]}>
                        <Text style={styles.xpText}>{player.xp} / {player.requiredXP} XP</Text>
                    </View>
                </View>
                <View style={styles.starCircle}>
                    <Ionicons name="star" size={16} color="#FF9600" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: 'transparent',
        zIndex: 1000,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    levelBadge: {
        backgroundColor: '#FFF8E6',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    levelText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#FF9600',
        letterSpacing: 0.5,
    },
    currencyRow: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingLeft: 4,
        paddingRight: 12,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    rupeeIcon: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#4B4B4B',
    },
    aetherIcon: {
        width: 18,
        height: 18,
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    xpBarTrack: {
        flex: 1,
        height: 24,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#F0F0F0',
    },
    xpBarFill: {
        height: '100%',
        backgroundColor: '#B8FF66', // Bright lime green from ref
        justifyContent: 'center',
        alignItems: 'center',
    },
    xpText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#46A302',
        letterSpacing: 0.5,
    },
    starCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -10,
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
});
