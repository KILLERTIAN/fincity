import { GameCard } from '@/components/ui/game-card';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { TransferMoneyModal } from '@/components/ui/TransferMoneyModal';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout, SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Extended friends data with online status
const ALL_FRIENDS = [
    { id: '1', name: 'Candy', isOnline: true, trustScore: 92, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Candy', level: 10, lastActive: 'now' },
    { id: '2', name: 'KraPex', isOnline: true, trustScore: 88, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=KraPex', level: 8, lastActive: 'now' },
    { id: '3', name: 'Necrosma', isOnline: true, trustScore: 85, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Necrosma', level: 12, lastActive: 'now' },
    { id: '4', name: 'Baigan', isOnline: true, trustScore: 78, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Baigan', level: 8, lastActive: 'now' },
    { id: '5', name: 'Astral Monk', isOnline: false, trustScore: 95, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Astral', level: 5, lastActive: '2h ago' },
    { id: '6', name: 'Ansh', isOnline: false, trustScore: 82, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Ansh', level: 15, lastActive: '1d ago' },
    { id: '7', name: 'STARLEX', isOnline: false, trustScore: 76, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=STARLEX', level: 4, lastActive: '3d ago' },
];

// Suggested friends
const SUGGESTED_FRIENDS = [
    { id: 's1', name: 'Maya', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Maya', level: 7, mutualFriends: 3 },
    { id: 's2', name: 'Rohan', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Rohan', level: 9, mutualFriends: 5 },
    { id: 's3', name: 'Priya', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Priya', level: 6, mutualFriends: 2 },
];

// Friend requests
const FRIEND_REQUESTS = [
    { id: 'r1', name: 'Vikram', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Vikram', level: 11, mutualFriends: 4 },
    { id: 'r2', name: 'Sneha', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Sneha', level: 8, mutualFriends: 2 },
];

const NEED_HELP = [
    { id: '1', name: 'Leo', amount: 50, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Leo' },
    { id: '2', name: 'Chloe', amount: 120, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Chloe', badge: true },
    { id: '3', name: 'Jordan', amount: 20, avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Jordan' },
];

type TabType = 'friends' | 'requests' | 'discover';

export default function SocialScreen() {
    const { gameState, addFriend } = useGame();
    const { player } = gameState;
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabType>('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [friends, setFriends] = useState(ALL_FRIENDS);
    const [requests, setRequests] = useState(FRIEND_REQUESTS);
    const [suggested, setSuggested] = useState(SUGGESTED_FRIENDS);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedTransferFriend, setSelectedTransferFriend] = useState<any>(null);

    const { width } = useWindowDimensions();
    const isLargeScreen = width > 768;

    const onlineFriends = friends.filter(f => f.isOnline);
    const offlineFriends = friends.filter(f => !f.isOnline);

    const filteredFriends = searchQuery
        ? friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : friends;

    const handleAcceptRequest = (requestId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const request = requests.find(r => r.id === requestId);
        if (request) {
            // Add to friends
            setFriends(prev => [...prev, {
                ...request,
                isOnline: false,
                trustScore: 50,
                lastActive: 'Just added'
            }]);
            // Remove from requests
            setRequests(prev => prev.filter(r => r.id !== requestId));
        }
    };

    const handleDeclineRequest = (requestId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const handleAddSuggested = (friendId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const friend = suggested.find(f => f.id === friendId);
        if (friend) {
            Alert.alert('Request Sent!', `Friend request sent to ${friend.name}`);
            setSuggested(prev => prev.filter(f => f.id !== friendId));
        }
    };

    const handleViewProfile = (friend: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedTransferFriend({
            id: friend.id,
            name: friend.name,
            avatar: friend.avatar
        });
        setShowTransferModal(true);
    };

    return (
        <ScreenWrapper>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
                <StatusBar style="dark" />

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={{ height: 10 }} />

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>Social Hub</Text>
                        <View style={styles.headerActions}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.searchBtn,
                                    { transform: [{ scale: pressed ? 0.92 : 1 }] }
                                ]}
                                onPress={() => setShowSearchModal(true)}
                            >
                                <Ionicons name="search" size={20} color="#1F1F1F" />
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.addFriendBtn,
                                    { transform: [{ scale: pressed ? 0.92 : 1 }] }
                                ]}
                                onPress={() => setActiveTab('discover')}
                            >
                                <Ionicons name="person-add" size={20} color="#1F1F1F" />
                            </Pressable>
                        </View>
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

                    {/* Tab Bar */}
                    <View style={styles.tabBar}>
                        <Pressable
                            style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
                            onPress={() => setActiveTab('friends')}
                        >
                            <Ionicons
                                name="people"
                                size={20}
                                color={activeTab === 'friends' ? '#1CB0F6' : '#8B8B8B'}
                            />
                            <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
                                Friends
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
                            onPress={() => setActiveTab('requests')}
                        >
                            <Ionicons
                                name="mail"
                                size={20}
                                color={activeTab === 'requests' ? '#1CB0F6' : '#8B8B8B'}
                            />
                            <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
                                Requests
                            </Text>
                            {requests.length > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{requests.length}</Text>
                                </View>
                            )}
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'discover' && styles.tabActive]}
                            onPress={() => setActiveTab('discover')}
                        >
                            <Ionicons
                                name="compass"
                                size={20}
                                color={activeTab === 'discover' ? '#1CB0F6' : '#8B8B8B'}
                            />
                            <Text style={[styles.tabText, activeTab === 'discover' && styles.tabTextActive]}>
                                Discover
                            </Text>
                        </Pressable>
                    </View>

                    {/* Friends Tab Content */}
                    {activeTab === 'friends' && (
                        <Animated.View entering={FadeIn.duration(300)}>
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

                            {/* Online Friends */}
                            {onlineFriends.length > 0 && (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <View style={styles.sectionTitleRow}>
                                            <View style={styles.onlineDot} />
                                            <Text style={styles.sectionTitle}>Online Now ({onlineFriends.length})</Text>
                                        </View>
                                    </View>

                                    {onlineFriends.map((friend, idx) => (
                                        <Animated.View
                                            key={friend.id}
                                            entering={SlideInRight.delay(idx * 50)}
                                        >
                                            <Pressable
                                                onPress={() => handleViewProfile(friend)}
                                                style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                                            >
                                                <GameCard style={styles.friendCard}>
                                                    <View style={styles.friendCardLeft}>
                                                        <View style={styles.friendAvatarContainer}>
                                                            <Image source={{ uri: friend.avatar }} style={styles.friendCardAvatar} />
                                                            <View style={styles.onlineIndicator} />
                                                        </View>
                                                        <View>
                                                            <Text style={styles.friendCardName}>{friend.name}</Text>
                                                            <Text style={styles.friendCardLevel}>Level {friend.level}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.friendCardRight}>
                                                        <View style={styles.trustBadge}>
                                                            <Ionicons name="shield-checkmark" size={14} color="#58CC02" />
                                                            <Text style={styles.trustText}>{friend.trustScore}</Text>
                                                        </View>
                                                        <Ionicons name="chevron-forward" size={20} color="#AFAFAF" />
                                                    </View>
                                                </GameCard>
                                            </Pressable>
                                        </Animated.View>
                                    ))}
                                </>
                            )}

                            {/* Offline Friends */}
                            {offlineFriends.length > 0 && (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <Text style={[styles.sectionTitle, { color: '#8B8B8B' }]}>
                                            Offline ({offlineFriends.length})
                                        </Text>
                                    </View>

                                    {offlineFriends.map((friend, idx) => (
                                        <Animated.View
                                            key={friend.id}
                                            entering={SlideInRight.delay(idx * 50)}
                                        >
                                            <Pressable
                                                onPress={() => handleViewProfile(friend)}
                                                style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                                            >
                                                <GameCard style={[styles.friendCard, styles.offlineCard]}>
                                                    <View style={styles.friendCardLeft}>
                                                        <View style={styles.friendAvatarContainer}>
                                                            <Image
                                                                source={{ uri: friend.avatar }}
                                                                style={[styles.friendCardAvatar, styles.offlineAvatar]}
                                                            />
                                                        </View>
                                                        <View>
                                                            <Text style={[styles.friendCardName, styles.offlineName]}>{friend.name}</Text>
                                                            <Text style={styles.friendCardLevel}>Last seen {friend.lastActive}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.friendCardRight}>
                                                        <View style={[styles.trustBadge, styles.offlineTrustBadge]}>
                                                            <Ionicons name="shield-checkmark" size={14} color="#8B8B8B" />
                                                            <Text style={[styles.trustText, { color: '#8B8B8B' }]}>{friend.trustScore}</Text>
                                                        </View>
                                                        <Ionicons name="chevron-forward" size={20} color="#AFAFAF" />
                                                    </View>
                                                </GameCard>
                                            </Pressable>
                                        </Animated.View>
                                    ))}
                                </>
                            )}
                        </Animated.View>
                    )}

                    {/* Requests Tab Content */}
                    {activeTab === 'requests' && (
                        <Animated.View entering={FadeIn.duration(300)}>
                            {requests.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <View style={styles.emptyIconBox}>
                                        <Ionicons name="mail-open-outline" size={48} color="#AFAFAF" />
                                    </View>
                                    <Text style={styles.emptyTitle}>No Pending Requests</Text>
                                    <Text style={styles.emptySubtitle}>Friend requests will appear here</Text>
                                </View>
                            ) : (
                                requests.map((request, idx) => (
                                    <Animated.View
                                        key={request.id}
                                        entering={SlideInRight.delay(idx * 100)}
                                        layout={Layout.springify()}
                                    >
                                        <GameCard style={styles.requestCard}>
                                            <View style={styles.requestTop}>
                                                <Image source={{ uri: request.avatar }} style={styles.requestAvatar} />
                                                <View style={styles.requestInfo}>
                                                    <Text style={styles.requestName}>{request.name}</Text>
                                                    <Text style={styles.requestMeta}>
                                                        Level {request.level} • {request.mutualFriends} mutual friends
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.requestActions}>
                                                <Pressable
                                                    style={({ pressed }) => [
                                                        styles.declineBtn,
                                                        { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                                    ]}
                                                    onPress={() => handleDeclineRequest(request.id)}
                                                >
                                                    <Text style={styles.declineBtnText}>Decline</Text>
                                                </Pressable>
                                                <Pressable
                                                    style={({ pressed }) => [
                                                        styles.acceptBtn,
                                                        { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                                    ]}
                                                    onPress={() => handleAcceptRequest(request.id)}
                                                >
                                                    <Ionicons name="checkmark" size={18} color="white" />
                                                    <Text style={styles.acceptBtnText}>Accept</Text>
                                                </Pressable>
                                            </View>
                                        </GameCard>
                                    </Animated.View>
                                ))
                            )}
                        </Animated.View>
                    )}

                    {/* Discover Tab Content */}
                    {activeTab === 'discover' && (
                        <Animated.View entering={FadeIn.duration(300)}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Suggested For You</Text>
                            </View>

                            {suggested.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <View style={styles.emptyIconBox}>
                                        <Ionicons name="people-outline" size={48} color="#AFAFAF" />
                                    </View>
                                    <Text style={styles.emptyTitle}>No Suggestions</Text>
                                    <Text style={styles.emptySubtitle}>Check back later for new people to connect with</Text>
                                </View>
                            ) : (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.suggestedHorizontal}
                                    contentContainerStyle={styles.suggestedContent}
                                >
                                    {suggested.map((person, idx) => (
                                        <Animated.View
                                            key={person.id}
                                            entering={FadeInDown.delay(idx * 100)}
                                        >
                                            <View style={styles.suggestedCardCompact}>
                                                <Image source={{ uri: person.avatar }} style={styles.suggestedAvatarCompact} />
                                                <Text style={styles.suggestedNameCompact} numberOfLines={1}>{person.name}</Text>
                                                <Text style={styles.suggestedMetaCompact}>Level {person.level}</Text>
                                                <Text style={styles.mutualText}>{person.mutualFriends} mutual</Text>
                                                <Pressable
                                                    style={({ pressed }) => [
                                                        styles.addBtnCompact,
                                                        { transform: [{ scale: pressed ? 0.9 : 1 }] }
                                                    ]}
                                                    onPress={() => handleAddSuggested(person.id)}
                                                >
                                                    <Ionicons name="person-add" size={16} color="white" />
                                                    <Text style={styles.addBtnText}>Add</Text>
                                                </Pressable>
                                            </View>
                                        </Animated.View>
                                    ))}
                                </ScrollView>
                            )}

                            {/* Invite Friends */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Invite Friends</Text>
                            </View>

                            <GameCard style={styles.inviteCard}>
                                <View style={styles.inviteCardIcon}>
                                    <Ionicons name="share-social" size={32} color="#1CB0F6" />
                                </View>
                                <View style={styles.inviteCardContent}>
                                    <Text style={styles.inviteCardTitle}>Share FinCity</Text>
                                    <Text style={styles.inviteCardDesc}>Invite friends and both earn 50 gems!</Text>
                                </View>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.shareBtn,
                                        { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                    ]}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        Alert.alert('Share', 'Share functionality coming soon!');
                                    }}
                                >
                                    <Text style={styles.shareBtnText}>Share</Text>
                                </Pressable>
                            </GameCard>
                        </Animated.View>
                    )}

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

                {/* Search Modal */}
                <Modal
                    visible={showSearchModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowSearchModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.searchModal}>
                            <View style={styles.searchHeader}>
                                <View style={styles.searchInputContainer}>
                                    <Ionicons name="search" size={20} color="#8B8B8B" />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search friends..."
                                        placeholderTextColor="#AFAFAF"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        autoFocus
                                    />
                                    {searchQuery.length > 0 && (
                                        <Pressable onPress={() => setSearchQuery('')}>
                                            <Ionicons name="close-circle" size={20} color="#AFAFAF" />
                                        </Pressable>
                                    )}
                                </View>
                                <Pressable
                                    style={styles.cancelBtn}
                                    onPress={() => {
                                        setSearchQuery('');
                                        setShowSearchModal(false);
                                    }}
                                >
                                    <Text style={styles.cancelBtnText}>Cancel</Text>
                                </Pressable>
                            </View>

                            <ScrollView style={styles.searchResults}>
                                {filteredFriends.length === 0 ? (
                                    <View style={styles.noResults}>
                                        <Text style={styles.noResultsText}>No friends found</Text>
                                    </View>
                                ) : (
                                    filteredFriends.map(friend => (
                                        <Pressable
                                            key={friend.id}
                                            style={styles.searchResultItem}
                                            onPress={() => {
                                                setShowSearchModal(false);
                                                handleViewProfile(friend);
                                            }}
                                        >
                                            <Image source={{ uri: friend.avatar }} style={styles.searchResultAvatar} />
                                            <View style={styles.searchResultInfo}>
                                                <Text style={styles.searchResultName}>{friend.name}</Text>
                                                <Text style={styles.searchResultMeta}>
                                                    Level {friend.level} • {friend.isOnline ? 'Online' : `Last seen ${friend.lastActive}`}
                                                </Text>
                                            </View>
                                            {friend.isOnline && <View style={styles.searchOnlineDot} />}
                                        </Pressable>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <TransferMoneyModal
                    visible={showTransferModal}
                    onClose={() => {
                        setShowTransferModal(false);
                        setSelectedTransferFriend(null);
                    }}
                    preSelectedFriend={selectedTransferFriend}
                />
            </SafeAreaView >
        </ScreenWrapper >
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
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    searchBtn: {
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
        marginBottom: 24,
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
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    tabActive: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#8B8B8B',
    },
    tabTextActive: {
        color: '#1CB0F6',
    },
    badge: {
        backgroundColor: '#FF4B4B',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 6,
        marginLeft: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: 'white',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#58CC02',
    },
    friendsHorizontal: {
        marginHorizontal: -20,
        marginBottom: 24,
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
    friendCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 12,
        borderRadius: 24,
    },
    offlineCard: {
        opacity: 0.7,
    },
    friendCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    friendAvatarContainer: {
        position: 'relative',
    },
    friendCardAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    offlineAvatar: {
        opacity: 0.6,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#58CC02',
        borderWidth: 3,
        borderColor: 'white',
    },
    friendCardName: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    offlineName: {
        color: '#8B8B8B',
    },
    friendCardLevel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    friendCardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    offlineTrustBadge: {
        backgroundColor: '#F5F5F5',
    },
    trustText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#58CC02',
    },
    // Request card styles
    requestCard: {
        padding: 20,
        marginBottom: 16,
        borderRadius: 24,
    },
    requestTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    requestAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    requestInfo: {
        flex: 1,
    },
    requestName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    requestMeta: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    requestActions: {
        flexDirection: 'row',
        gap: 12,
    },
    declineBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
    },
    declineBtnText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#8B8B8B',
    },
    acceptBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: '#58CC02',
        gap: 6,
    },
    acceptBtnText: {
        fontSize: 14,
        fontWeight: '900',
        color: 'white',
    },
    // Suggested card styles
    suggestedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 24,
        gap: 14,
    },
    suggestedAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    suggestedInfo: {
        flex: 1,
    },
    suggestedName: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    suggestedMeta: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1CB0F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Compact suggested card styles
    suggestedHorizontal: {
        marginHorizontal: -20,
        marginBottom: 24,
    },
    suggestedContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    suggestedCardCompact: {
        width: 120,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 14,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    suggestedAvatarCompact: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginBottom: 10,
    },
    suggestedNameCompact: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
    },
    suggestedMetaCompact: {
        fontSize: 11,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    mutualText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#1CB0F6',
        marginBottom: 10,
    },
    addBtnCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#1CB0F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    addBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: 'white',
    },
    // Invite card styles
    inviteCard: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 24,
        gap: 16,
    },
    inviteCardIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E6F4FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    inviteCardContent: {
        alignItems: 'center',
        marginBottom: 8,
    },
    inviteCardTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
        textAlign: 'center',
    },
    inviteCardDesc: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B8B8B',
        textAlign: 'center',
        maxWidth: 240,
    },
    shareBtn: {
        width: '100%',
        backgroundColor: '#1CB0F6',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderColor: '#1199D4',
    },
    shareBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    // Empty state
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIconBox: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B8B8B',
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
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    searchModal: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 50,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1F1F1F',
    },
    cancelBtn: {
        padding: 8,
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1CB0F6',
    },
    searchResults: {
        flex: 1,
        padding: 20,
    },
    noResults: {
        alignItems: 'center',
        paddingTop: 40,
    },
    noResultsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        gap: 14,
    },
    searchResultAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    searchResultInfo: {
        flex: 1,
    },
    searchResultName: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    searchResultMeta: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    searchOnlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#58CC02',
    },
});
