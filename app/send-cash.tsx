import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: 'pizza', label: 'Pizza', icon: 'pizza-outline', color: '#FF9600' },
    { id: 'game', label: 'Game', icon: 'game-controller-outline', color: '#CE82FF' },
    { id: 'movie', label: 'Movie', icon: 'videocam-outline', color: '#1CB0F6' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#8B8B8B' },
];

export default function SendCashScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [amount, setAmount] = useState(25);
    const [selectedCategory, setSelectedCategory] = useState('pizza');
    const maxAmount = 142.50;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.headerBtn,
                        { transform: [{ scale: pressed ? 0.9 : 1 }] }
                    ]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#1F1F1F" />
                </Pressable>
                <Text style={styles.headerTitle}>Send Cash</Text>
                <Pressable style={styles.headerBtn}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#FFB800" />
                </Pressable>
            </View>

            <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Recipient Avatar */}
                    <View style={styles.recipientSection}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarRing}>
                                <Image
                                    source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Leo' }}
                                    style={styles.avatar}
                                />
                            </View>
                            <View style={styles.onlineBadge} />
                        </View>
                        <Text style={styles.sendingToLabel}>SENDING TO</Text>
                        <Text style={styles.recipientName}>Leo Dasher</Text>
                    </View>

                    {/* Amount Card */}
                    <View style={styles.amountCard}>
                        <Text style={styles.amountDisplay}>₹{amount.toFixed(2)}</Text>
                        <Text style={styles.availableText}>AVAILABLE: ₹{maxAmount.toFixed(2)}</Text>

                        {/* Slider */}
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={maxAmount}
                                value={amount}
                                onValueChange={(val) => {
                                    setAmount(val);
                                    if (Math.floor(val) % 10 === 0) Haptics.selectionAsync();
                                }}
                                minimumTrackTintColor="#FFB800"
                                maximumTrackTintColor="#F0F0F0"
                                thumbTintColor="#FFB800"
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>₹1</Text>
                                <Text style={styles.sliderLabel}>₹{maxAmount.toFixed(0)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Category Selection */}
                    <Text style={styles.sectionTitle}>What's it for?</Text>
                    <View style={styles.categoriesGrid}>
                        {CATEGORIES.map((cat) => (
                            <Pressable
                                key={cat.id}
                                style={({ pressed }) => [
                                    styles.categoryButton,
                                    selectedCategory === cat.id && styles.categoryButtonActive,
                                    { transform: [{ scale: pressed ? 0.95 : 1 }] }
                                ]}
                                onPress={() => {
                                    setSelectedCategory(cat.id);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                            >
                                <Ionicons name={cat.icon as any} size={34} color={selectedCategory === cat.id ? '#FFB800' : '#8B8B8B'} />
                                <Text style={[
                                    styles.categoryLabel,
                                    selectedCategory === cat.id && styles.categoryLabelActive
                                ]}>
                                    {cat.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Pro Tip */}
                    <View style={styles.tipCard}>
                        <View style={styles.tipIconBox}>
                            <Ionicons name="bulb" size={26} color="#46A302" />
                        </View>
                        <View style={styles.tipContent}>
                            <Text style={styles.tipTitle}>PRO TIP: TRUST</Text>
                            <Text style={styles.tipText}>
                                Lending money is about trust! Only send cash if you're okay with waiting to get it back.
                            </Text>
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Send Button */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.sendButton,
                        { transform: [{ scale: pressed ? 0.98 : 1 }] }
                    ]}
                    onPress={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }}
                >
                    <Ionicons name="paper-plane" size={22} color="white" />
                    <Text style={styles.sendButtonText}>SEND ₹{amount.toFixed(2)}</Text>
                </Pressable>
            </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
        zIndex: 10,
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    recipientSection: {
        alignItems: 'center',
        paddingVertical: 36,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarRing: {
        width: 104,
        height: 104,
        borderRadius: 52,
        borderWidth: 4,
        borderColor: '#B8FF66',
        padding: 4,
        backgroundColor: 'white',
        shadowColor: '#B8FF66',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#46A302',
        borderWidth: 3,
        borderColor: 'white',
        zIndex: 2,
    },
    sendingToLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    recipientName: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    amountCard: {
        backgroundColor: 'white',
        borderRadius: 36,
        padding: 32,
        marginBottom: 36,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
    amountDisplay: {
        fontSize: 56,
        fontWeight: '900',
        color: '#FFB800',
        textAlign: 'center',
        marginBottom: 8,
    },
    availableText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#FFB800',
        textAlign: 'center',
        letterSpacing: 1.2,
        marginBottom: 32,
    },
    sliderContainer: {
        marginTop: 10,
    },
    slider: {
        width: '100%',
        height: 48,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sliderLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#8B8B8B',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 20,
    },
    categoriesGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 36,
    },
    categoryButton: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        gap: 8,
    },
    categoryButtonActive: {
        borderColor: '#FFB800',
        backgroundColor: '#FFF9E6',
        elevation: 4,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    categoryIcon: {
        fontSize: 34,
    },
    categoryLabel: {
        fontSize: 13,
        fontWeight: '900',
        color: '#8B8B8B',
    },
    categoryLabelActive: {
        color: '#FF9600',
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#E8F5E9',
        borderRadius: 28,
        padding: 24,
        gap: 18,
        borderWidth: 1,
        borderColor: 'rgba(70,163,2,0.1)',
    },
    tipIconBox: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 13,
        fontWeight: '900',
        color: '#46A302',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    tipText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1F1F1F',
        lineHeight: 20,
    },
    bottomBar: {
        padding: 24,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    sendButton: {
        flexDirection: 'row',
        backgroundColor: '#1F1F1F',
        paddingVertical: 20,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    sendButtonText: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 1.2,
    },
});
