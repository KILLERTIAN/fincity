import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useGame } from '@/contexts/game-context';
import { authApi } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AVATAR_OPTIONS = [
    { icon: 'happy', bg: '#FFE0B2', seed: 'happy1' },
    { icon: 'glasses', bg: '#E1BEE7', seed: 'cool1' },
    { icon: 'paw', bg: '#B3E5FC', seed: 'pet1' },
    { icon: 'rocket', bg: '#FFCCBC', seed: 'space1' },
    { icon: 'planet', bg: '#F5F5F5', seed: 'planet1' },
    { icon: 'flame', bg: '#FFE082', seed: 'fire1' },
    { icon: 'heart', bg: '#FFAB91', seed: 'love1' },
    { icon: 'leaf', bg: '#C8E6C9', seed: 'nature1' },
    { icon: 'sunny', bg: '#F8BBD9', seed: 'sunny1' },
    { icon: 'water', bg: '#B2DFDB', seed: 'water1' },
    { icon: 'airplane', bg: '#B3E5FC', seed: 'travel1' },
    { icon: 'football', bg: '#E1BEE7', seed: 'sport1' },
];

export default function ProfileScreen() {
    const { gameState } = useGame();
    const { player } = gameState;
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(player.name);
    const [selectedAvatar, setSelectedAvatar] = useState('happy');
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const savedAvatar = await AsyncStorage.getItem('userAvatar');
            if (savedAvatar) setSelectedAvatar(savedAvatar);
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await authApi.logout();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const handleSaveProfile = async () => {
        try {
            await AsyncStorage.setItem('userName', editName);
            await AsyncStorage.setItem('userAvatar', selectedAvatar);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    const handleSelectAvatar = (icon: string) => {
        setSelectedAvatar(icon);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const stats = [
        { label: 'Level', value: player.level, icon: 'star', color: '#FFB800' },
        { label: 'XP', value: `${player.xp}/${player.requiredXP}`, icon: 'flash', color: '#1CB0F6' },
        { label: 'Energy', value: `${player.energy}%`, icon: 'battery-full', color: '#58CC02' },
        { label: 'Mood', value: `${player.mood}%`, icon: 'happy', color: '#FF6B35' },
    ];

    const achievements = gameState.achievements?.filter(a => a.unlocked) || [];

    return (
        <ScreenWrapper>
            <StatusBar style="dark" />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.backBtn,
                            {
                                opacity: pressed ? 0.7 : 1,
                                transform: [{ scale: pressed ? 0.92 : 1 }]
                            }
                        ]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
                    </Pressable>
                    <Text style={styles.topBarTitle}>PROFILE</Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.editBtn,
                            {
                                opacity: pressed ? 0.7 : 1,
                                transform: [{ scale: pressed ? 0.92 : 1 }]
                            }
                        ]}
                        onPress={() => setIsEditing(!isEditing)}
                    >
                        <Ionicons name={isEditing ? 'close' : 'create'} size={24} color="#1F1F1F" />
                    </Pressable>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Profile Card */}
                    <Animated.View entering={FadeIn.duration(400)} style={styles.profileCard}>
                        <Pressable
                            style={styles.avatarContainer}
                            onPress={() => isEditing && setShowAvatarModal(true)}
                        >
                            <View style={styles.avatarBox}>
                                <Image
                                    source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=boy2&backgroundColor=FBD4A3' }}
                                    style={styles.avatarImage}
                                />
                            </View>
                            {isEditing && (
                                <View style={styles.editAvatarBadge}>
                                    <Ionicons name="camera" size={16} color="white" />
                                </View>
                            )}
                        </Pressable>

                        {isEditing ? (
                            <TextInput
                                style={styles.nameInput}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Your Name"
                                placeholderTextColor="#AFAFAF"
                            />
                        ) : (
                            <Text style={styles.playerName}>{player.name}</Text>
                        )}

                        <View style={styles.masterBadge}>
                            <Ionicons name="shield" size={12} color="#8B8B8B" />
                            <Text style={styles.playerLevel}>LEVEL {player.level} MASTER</Text>
                        </View>

                        {/* XP Progress */}
                        <View style={styles.xpContainer}>
                            <View style={styles.xpBar}>
                                <View style={[styles.xpFill, { width: `${(player.xp / player.requiredXP) * 100}%` }]} />
                            </View>
                            <Text style={styles.xpText}>{player.xp} / {player.requiredXP} XP</Text>
                        </View>

                        {isEditing && (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.saveBtn,
                                    { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                ]}
                                onPress={handleSaveProfile}
                            >
                                <Ionicons name="checkmark" size={20} color="white" />
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            </Pressable>
                        )}
                    </Animated.View>

                    {/* Stats Grid */}
                    <Text style={styles.sectionHeaderCompact}>YOUR PERFORMANCE</Text>
                    <View style={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <Animated.View
                                key={stat.label}
                                entering={FadeInDown.delay(index * 80).duration(300)}
                                style={styles.statCard}
                            >
                                <View style={[styles.statIconBox, { backgroundColor: stat.color + '15' }]}>
                                    <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                                </View>
                                <View style={styles.statTextContainer}>
                                    <Text style={styles.statLabel}>{stat.label.toUpperCase()}</Text>
                                    <View style={styles.statValueRow}>
                                        <Text style={styles.statValue}>{stat.value}</Text>
                                        {stat.label === 'XP' && <Text style={styles.statUnit}>XP</Text>}
                                    </View>
                                </View>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Financial Summary */}
                    <Text style={styles.sectionHeaderCompact}>FINANCIAL ASSETS</Text>
                    <View style={styles.financeCompact}>
                        <View style={styles.financeItemCompact}>
                            <View style={[styles.financeIcon, { backgroundColor: '#E6F4EA' }]}>
                                <Ionicons name="wallet-outline" size={20} color="#58CC02" />
                            </View>
                            <View>
                                <Text style={styles.financeLabelCompact}>WALLET</Text>
                                <Text style={styles.financeValueCompact}>₹{player.money.toFixed(0)}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.financeItemCompact}>
                            <View style={[styles.financeIcon, { backgroundColor: '#E6F4FF' }]}>
                                <Ionicons name="diamond-outline" size={20} color="#1CB0F6" />
                            </View>
                            <View>
                                <Text style={styles.financeLabelCompact}>GEMS</Text>
                                <Text style={styles.financeValueCompact}>{player.gems}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Achievements */}
                    <Text style={styles.sectionHeaderCompact}>ACHIEVEMENTS ({achievements.length})</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.achievementsScroll}
                        contentContainerStyle={styles.achievementsContent}
                    >
                        {achievements.map((achievement, index) => (
                            <Animated.View
                                key={achievement.id}
                                entering={SlideInRight.delay(index * 100)}
                                style={styles.achievementCard}
                            >
                                <View style={styles.achievementIcon}>
                                    <Ionicons name={achievement.icon as any} size={28} color="#FFB800" />
                                </View>
                                <Text style={styles.achievementName}>{achievement.name}</Text>
                            </Animated.View>
                        ))}
                        {achievements.length === 0 && (
                            <View style={styles.noAchievements}>
                                <Ionicons name="trophy-outline" size={48} color="#AFAFAF" />
                                <Text style={styles.noAchievementsText}>Complete tasks to earn achievements!</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Settings Quick Links */}
                    <Text style={styles.sectionHeaderCompact}>SETTINGS</Text>
                    <View style={styles.settingsCard}>
                        <Pressable style={styles.settingItem}>
                            <View style={[styles.settingIcon, { backgroundColor: '#E6F4FF' }]}>
                                <Ionicons name="musical-notes" size={20} color="#1CB0F6" />
                            </View>
                            <Text style={styles.settingText}>Sound & Music</Text>
                            <Ionicons name="chevron-forward" size={20} color="#AFAFAF" />
                        </Pressable>
                        <Pressable style={styles.settingItem}>
                            <View style={[styles.settingIcon, { backgroundColor: '#FFF0EB' }]}>
                                <Ionicons name="notifications" size={20} color="#FF6B35" />
                            </View>
                            <Text style={styles.settingText}>Notifications</Text>
                            <Ionicons name="chevron-forward" size={20} color="#AFAFAF" />
                        </Pressable>
                        <Pressable style={styles.settingItem}>
                            <View style={[styles.settingIcon, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="shield-checkmark" size={20} color="#58CC02" />
                            </View>
                            <Text style={styles.settingText}>Privacy</Text>
                            <Ionicons name="chevron-forward" size={20} color="#AFAFAF" />
                        </Pressable>
                        <Pressable style={styles.settingItem} onPress={handleLogout}>
                            <View style={[styles.settingIcon, { backgroundColor: '#FFEBEE' }]}>
                                <Ionicons name="log-out-outline" size={20} color="#FF4B4B" />
                            </View>
                            <Text style={[styles.settingText, { color: '#FF4B4B' }]}>Sign Out</Text>
                            <Ionicons name="chevron-forward" size={20} color="#FF4B4B" />
                        </Pressable>
                        <Pressable
                            style={styles.settingItem}
                            onPress={async () => {
                                await AsyncStorage.clear();
                                router.replace('/onboarding');
                            }}
                        >
                            <View style={[styles.settingIcon, { backgroundColor: '#F0F0F0' }]}>
                                <Ionicons name="refresh-circle" size={20} color="#1F1F1F" />
                            </View>
                            <Text style={styles.settingText}>Reset App Data (Debug)</Text>
                            <Ionicons name="chevron-forward" size={20} color="#8B8B8B" />
                        </Pressable>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Avatar Selection Modal */}
            <Modal
                visible={showAvatarModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowAvatarModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.avatarModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choose Avatar</Text>
                            <Pressable onPress={() => setShowAvatarModal(false)}>
                                <Ionicons name="close" size={28} color="#1F1F1F" />
                            </Pressable>
                        </View>
                        <View style={styles.avatarGrid}>
                            {AVATAR_OPTIONS.map((item) => (
                                <Pressable
                                    key={item.icon}
                                    style={[
                                        styles.avatarOption,
                                        { backgroundColor: item.bg },
                                        selectedAvatar === item.icon && styles.avatarOptionSelected,
                                    ]}
                                    onPress={() => handleSelectAvatar(item.icon)}
                                >
                                    <Ionicons
                                        name={item.icon as any}
                                        size={32}
                                        color={selectedAvatar === item.icon ? '#1F1F1F' : 'rgba(0,0,0,0.5)'}
                                    />
                                    {selectedAvatar === item.icon && (
                                        <View style={styles.checkmark}>
                                            <Ionicons name="checkmark-circle" size={20} color="#58CC02" />
                                        </View>
                                    )}
                                </Pressable>
                            ))}
                        </View>
                        <Pressable
                            style={({ pressed }) => [
                                styles.confirmBtn,
                                { transform: [{ scale: pressed ? 0.95 : 1 }] }
                            ]}
                            onPress={() => setShowAvatarModal(false)}
                        >
                            <Text style={styles.confirmBtnText}>Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
    headerBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
    },
    meshGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 350,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
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
    topBarTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    editBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 20,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarBox: {
        width: 110,
        height: 110,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBD4A3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: 'white',
    },
    avatarImage: {
        width: 100,
        height: 100,
    },
    editAvatarBadge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1CB0F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    playerName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    nameInput: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
        borderBottomWidth: 2,
        borderColor: '#1CB0F6',
        paddingBottom: 4,
        marginBottom: 4,
        minWidth: 150,
    },
    masterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
    },
    playerLevel: {
        fontSize: 11,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 1,
    },
    xpContainer: {
        width: '100%',
        marginBottom: 16,
    },
    xpBar: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 6,
    },
    xpFill: {
        height: '100%',
        backgroundColor: '#1CB0F6',
        borderRadius: 4,
    },
    xpText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B8B8B',
        textAlign: 'center',
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#58CC02',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 20,
        gap: 8,
        shadowColor: '#58CC02',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    sectionHeaderCompact: {
        fontSize: 10,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 1.5,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        width: (width - 52) / 2,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    statIconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statTextContainer: {
        flex: 1,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    statUnit: {
        fontSize: 10,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    statLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#8B8B8B',
        marginBottom: 1,
    },
    financeCompact: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    financeItemCompact: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 8,
    },
    financeIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    financeLabelCompact: {
        fontSize: 10,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 0.5,
    },
    financeValueCompact: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#F0F0F0',
    },
    achievementsScroll: {
        marginHorizontal: -20,
        marginBottom: 24,
    },
    achievementsContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    achievementCard: {
        width: 100,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFB800',
    },
    achievementIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF9E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    achievementName: {
        fontSize: 11,
        fontWeight: '800',
        color: '#1F1F1F',
        textAlign: 'center',
    },
    noAchievements: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
    },
    noAchievementsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#AFAFAF',
        textAlign: 'center',
        marginTop: 8,
    },
    settingsCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#F0F0F0',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    settingText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1F1F1F',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    avatarModal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        marginBottom: 20,
    },
    avatarOption: {
        width: 70,
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    avatarOptionSelected: {
        borderColor: '#58CC02',
    },
    checkmark: {
        position: 'absolute',
        top: -6,
        right: -6,
    },
    confirmBtn: {
        backgroundColor: '#58CC02',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    confirmBtnText: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
    },
});
