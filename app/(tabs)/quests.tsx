import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const QUIZZES = [
    { id: 'q1', title: 'Budgeting basics', xp: 50, icon: 'receipt', color: '#B8FF66' },
    { id: 'q2', title: 'Tax saving 101', xp: 80, icon: 'calculator', color: '#FFD700' },
    { id: 'q3', title: 'Power of Compound', xp: 120, icon: 'trending-up', color: '#FF6B35' },
];

const VIDEOS = [
    { id: 'v1', title: 'Investment 101', time: '8m', color: '#FF9600', image: require('@/assets/game/tiger.png') },
    { id: 'v2', title: 'Crypto Risks', time: '12m', color: '#FFB800', image: require('@/assets/game/lion.png') },
    { id: 'v3', title: 'Insurance Plan', time: '6m', color: '#795548', image: require('@/assets/game/bear.png') },
];

// Curved corner star for XP
const CurvedStar = ({ size = 16, color = '#FFB800' }: { size?: number, color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
            d="M12 2 L14.5 9.5 L22 10 L16.5 15 L18.5 22 L12 18 L5.5 22 L7.5 15 L2 10 L9.5 9.5 Z"
            fill={color}
            stroke={color}
            strokeWidth="0.5"
            strokeLinejoin="round"
        />
    </Svg>
);

export default function LearnScreen() {
    const { gameState } = useGame();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>Learning Hub</Text>
                        <Pressable
                            style={({ pressed }) => [
                                styles.headerBtn,
                                { transform: [{ scale: pressed ? 0.92 : 1 }] }
                            ]}
                            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        >
                            <Ionicons name="ribbon-outline" size={24} color="#1F1F1F" />
                        </Pressable>
                    </View>

                    {/* Featured Course Card */}
                    <LinearGradient
                        colors={['#1F1F1F', '#2D2D2D']}
                        style={styles.featuredCard}
                    >
                        <View style={styles.featuredTop}>
                            <View style={styles.featuredInfo}>
                                <Text style={styles.featuredLabel}>CURRENT COURSE</Text>
                                <Text style={styles.featuredTitle}>Foundations of Finance</Text>
                            </View>
                            {/* Fixed 50% Badge Placement */}
                            <View style={styles.percentBadge}>
                                <Text style={styles.percentText}>50%</Text>
                            </View>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressFill, { width: '50%' }]} />
                            </View>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.resumeBtn,
                                { transform: [{ scale: pressed ? 0.96 : 1 }] }
                            ]}
                            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                        >
                            <Ionicons name="play-circle" size={24} color="#1F1F1F" />
                            <Text style={styles.resumeBtnText}>Resume Learning</Text>
                        </Pressable>

                        <Ionicons name="school" size={140} color="rgba(184,255,102,0.05)" style={styles.bgIcon} />
                    </LinearGradient>

                    {/* Next Up (Videos) */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Next Up</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.horizontalVideos}
                        contentContainerStyle={styles.videosContent}
                    >
                        {VIDEOS.map((vid) => (
                            <Pressable
                                key={vid.id}
                                style={({ pressed }) => [
                                    styles.videoCard,
                                    { transform: [{ scale: pressed ? 0.96 : 1 }] }
                                ]}
                                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            >
                                <View style={[styles.videoThumbContainer, { backgroundColor: vid.color + '20' }]}>
                                    {/* Thumbnail Doodles */}
                                    <View style={styles.thumbDoodleContainer}>
                                        <Ionicons name="book-outline" size={16} color={vid.color} style={{ position: 'absolute', top: 10, left: 10, opacity: 0.3 }} />
                                        <Ionicons name="bulb-outline" size={14} color={vid.color} style={{ position: 'absolute', top: 20, right: 40, opacity: 0.3 }} />
                                        <Ionicons name="medal-outline" size={18} color={vid.color} style={{ position: 'absolute', bottom: 30, left: 20, opacity: 0.2 }} />
                                        <Ionicons name="star-outline" size={16} color={vid.color} style={{ position: 'absolute', top: 30, left: 30, opacity: 0.4 }} />
                                        <Ionicons name="bulb-outline" size={14} color={vid.color} style={{ position: 'absolute', bottom: 10, left: 10, opacity: 0.3 }} />
                                        <Ionicons name="medal-outline" size={18} color={vid.color} style={{ position: 'absolute', top: 15, left: 60, opacity: 0.2 }} />
                                    </View>

                                    <Image source={vid.image} style={styles.videoThumbImagePeek} resizeMode="contain" />
                                    <View style={styles.playOverlay}>
                                        <View style={[styles.playCircle, { backgroundColor: vid.color }]}>
                                            <Ionicons name="play" size={20} color="white" />
                                        </View>
                                    </View>
                                    <View style={styles.timeBadge}>
                                        <Text style={styles.timeText}>{vid.time}</Text>
                                    </View>
                                </View>
                                <Text style={styles.videoTitle}>{vid.title}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Daily Quizzes */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Daily Quizzes</Text>
                        <Pressable><Text style={styles.viewAllText}>View All</Text></Pressable>
                    </View>

                    {QUIZZES.map((quiz) => (
                        <Pressable
                            key={quiz.id}
                            style={({ pressed }) => [
                                styles.quizCard,
                                { transform: [{ scale: pressed ? 0.98 : 1 }] }
                            ]}
                            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        >
                            <View style={[styles.quizIconBox, { backgroundColor: quiz.color + '20' }]}>
                                <Ionicons name={quiz.icon as any} size={26} color={quiz.color} />
                            </View>
                            <View style={styles.quizInfo}>
                                <Text style={styles.quizTitle}>{quiz.title}</Text>
                                <View style={styles.xpReward}>
                                    <CurvedStar size={14} color="#FFB800" />
                                    <Text style={styles.xpText}>+{quiz.xp} XP</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#AFAFAF" />
                        </Pressable>
                    ))}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBFF',
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1F1F1F',
        letterSpacing: -0.5,
    },
    headerBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    featuredCard: {
        borderRadius: 32,
        padding: 24,
        paddingBottom: 20,
        marginBottom: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    featuredTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 20,
        position: 'relative',
        zIndex: 2,
    },
    featuredInfo: {
        flex: 1,
        paddingRight: 10,
    },
    featuredLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: 'white',
        lineHeight: 28,
    },
    percentBadge: {
        backgroundColor: '#B8FF66',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#B8FF66',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    percentText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    progressContainer: {
        marginBottom: 20,
        zIndex: 2,
    },
    progressTrack: {
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#B8FF66',
        borderRadius: 5,
    },
    resumeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B8FF66',
        paddingVertical: 14,
        borderRadius: 20,
        gap: 10,
        borderBottomWidth: 4,
        borderColor: '#46A302',
        zIndex: 2,
    },
    resumeBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    bgIcon: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        zIndex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    viewAllText: {
        fontSize: 15,
        fontWeight: '900',
        color: '#1CB0F6',
    },
    horizontalVideos: {
        marginHorizontal: -20,
        marginBottom: 24,
    },
    videosContent: {
        paddingHorizontal: 20,
        gap: 14,
    },
    videoCard: {
        width: 150,
    },
    videoThumbContainer: {
        width: 150,
        height: 110,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 10,
        position: 'relative',
    },
    videoThumbImagePeek: {
        width: 100,
        height: 100,
        position: 'absolute',
        right: -10,
        bottom: -15,
        opacity: 0.6,
        transform: [{ rotate: '-10deg' }],
    },
    thumbDoodleContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    playCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    timeBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'white',
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
        paddingHorizontal: 4,
    },
    quizCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 28,
        marginBottom: 14,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    quizIconBox: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    quizInfo: {
        flex: 1,
    },
    quizTitle: {
        fontSize: 17,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    xpReward: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    xpText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFB800',
    },
});
