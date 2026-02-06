import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useAudio } from '@/contexts/audio-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const { settings, toggleMusic, toggleSound } = useAudio();

    const settingsSections = [
        {
            title: 'Sound & Music',
            items: [
                {
                    icon: 'musical-notes',
                    iconBg: '#E6F4FF',
                    iconColor: '#1CB0F6',
                    label: 'Background Music',
                    type: 'toggle' as const,
                    value: settings.musicEnabled,
                    onToggle: toggleMusic,
                },
                {
                    icon: 'volume-high',
                    iconBg: '#FFF0EB',
                    iconColor: '#FF6B35',
                    label: 'Sound Effects',
                    type: 'toggle' as const,
                    value: settings.soundEnabled,
                    onToggle: toggleSound,
                },
            ],
        },
        {
            title: 'Account',
            items: [
                {
                    icon: 'person',
                    iconBg: '#E8F5E9',
                    iconColor: '#58CC02',
                    label: 'Edit Profile',
                    type: 'link' as const,
                    onPress: () => router.push('/profile'),
                },
                {
                    icon: 'notifications',
                    iconBg: '#FFF9E6',
                    iconColor: '#FFB800',
                    label: 'Notifications',
                    type: 'link' as const,
                    onPress: () => router.push('/notifications'),
                },
            ],
        },
        {
            title: 'About',
            items: [
                {
                    icon: 'information-circle',
                    iconBg: '#F3E5F5',
                    iconColor: '#9C27B0',
                    label: 'About FinCity',
                    type: 'link' as const,
                    onPress: () => { },
                },
                {
                    icon: 'document-text',
                    iconBg: '#E3F2FD',
                    iconColor: '#2196F3',
                    label: 'Terms of Service',
                    type: 'link' as const,
                    onPress: () => { },
                },
                {
                    icon: 'shield-checkmark',
                    iconBg: '#E8F5E9',
                    iconColor: '#4CAF50',
                    label: 'Privacy Policy',
                    type: 'link' as const,
                    onPress: () => { },
                },
            ],
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScreenWrapper>
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.backBtn,
                                { opacity: pressed ? 0.7 : 1 }
                            ]}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
                        </Pressable>
                        <Text style={styles.headerTitle}>Settings</Text>
                        <View style={{ width: 44 }} />
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {settingsSections.map((section, sectionIndex) => (
                            <Animated.View
                                key={section.title}
                                entering={FadeInDown.delay(sectionIndex * 100).duration(300)}
                            >
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={styles.sectionCard}>
                                    {section.items.map((item, itemIndex) => (
                                        <Pressable
                                            key={item.label}
                                            style={[
                                                styles.settingItem,
                                                itemIndex < section.items.length - 1 && styles.settingItemBorder,
                                            ]}
                                            onPress={() => {
                                                if (item.type === 'link' && item.onPress) {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                    item.onPress();
                                                }
                                            }}
                                        >
                                            <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
                                                <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
                                            </View>
                                            <Text style={styles.settingLabel}>{item.label}</Text>
                                            {item.type === 'toggle' && (
                                                <Switch
                                                    value={item.value}
                                                    onValueChange={() => {
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                        item.onToggle?.();
                                                    }}
                                                    trackColor={{ false: '#E0E0E0', true: '#58CC02' }}
                                                    thumbColor="white"
                                                />
                                            )}
                                            {item.type === 'link' && (
                                                <Ionicons name="chevron-forward" size={20} color="#AFAFAF" />
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            </Animated.View>
                        ))}

                        <View style={styles.footer}>
                            <Text style={styles.version}>FinCity v1.0.0</Text>
                            <Text style={styles.copyright}>Made with love for financial literacy</Text>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </ScreenWrapper>
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
    header: {
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
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#8B8B8B',
        marginBottom: 12,
        marginTop: 20,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionCard: {
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
    },
    settingItemBorder: {
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
    settingLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1F1F1F',
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
        paddingTop: 20,
    },
    version: {
        fontSize: 14,
        fontWeight: '700',
        color: '#AFAFAF',
    },
    copyright: {
        fontSize: 12,
        fontWeight: '600',
        color: '#CFCFCF',
        marginTop: 4,
    },
});
