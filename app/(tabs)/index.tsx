import { GameCard } from '@/components/ui/game-card';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { gameState } = useGame();
  const { player } = gameState;
  const router = useRouter();

  // Animated values for savings card
  const scale = useSharedValue(1);

  const handleAddMoney = () => {
    scale.value = withSpring(1.05, {}, () => {
      scale.value = withSpring(1);
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={['#EBF5FF', '#F8FBFF', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={{ height: 10 }} />

        {/* User Profile Info */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarMainContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=boy2&backgroundColor=FBD4A3' }}
                  style={styles.avatarImg}
                />
              </View>
              <View style={styles.avatarLevelBadge}>
                <Text style={styles.avatarLevelText}>{player.level}</Text>
              </View>
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.levelTag}>LEVEL {player.level} MASTER</Text>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingText}>Hi, Om!</Text>
                <Ionicons name="sparkles" size={20} color="#FFB800" />
              </View>
            </View>
          </View>
          <IconButton style={styles.notifButton} onPress={() => { }}>
            <Ionicons name="notifications" size={24} color="#1F1F1F" />
            <View style={styles.notifBadge} />
          </IconButton>
        </View>

        <Animated.View style={cardStyle}>
          <LinearGradient
            colors={['#B8FF66', '#A5F84D']}
            style={styles.savingsCard}
          >
            {/* Doodle Background */}
            <View style={styles.doodleContainer}>
              <Ionicons name="star" size={24} color="rgba(70,163,2,0.1)" style={styles.doodleIcon1} />
              <Ionicons name="cash" size={32} color="rgba(70,163,2,0.1)" style={styles.doodleIcon2} />
              <Ionicons name="diamond" size={20} color="rgba(70,163,2,0.1)" style={styles.doodleIcon3} />
              <Ionicons name="wallet" size={28} color="rgba(70,163,2,0.1)" style={styles.doodleIcon4} />
              <Ionicons name="trending-up" size={40} color="rgba(70,163,2,0.1)" style={styles.doodleIcon5} />
              <Ionicons name="trophy" size={24} color="rgba(70,163,2,0.1)" style={styles.doodleIcon6} />
              <Ionicons name="leaf" size={20} color="rgba(70,163,2,0.1)" style={styles.doodleIcon7} />
              <Ionicons name="rocket" size={28} color="rgba(70,163,2,0.1)" style={styles.doodleIcon8} />
              <Ionicons name="shield-checkmark" size={22} color="rgba(70,163,2,0.1)" style={styles.doodleIcon9} />
              <Ionicons name="stats-chart" size={24} color="rgba(70,163,2,0.1)" style={styles.doodleIcon10} />
            </View>

            <Text style={styles.savingsLabel}>TOTAL SAVINGS</Text>
            <Text style={styles.savingsAmount}>₹{player.money.toLocaleString('en-IN')}</Text>

            <IconButton
              style={styles.addMoneyBtn}
              onPress={handleAddMoney}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.addMoneyText}>Add Money</Text>
            </IconButton>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <ActionCard
            icon="wallet"
            label="Save"
            color="#FF6B35"
            bgColor="#FFF0EB"
            onPress={() => router.push('/wallet')}
          />
          <ActionCard
            icon="bag-handle"
            label="Spend"
            color="#FFB800"
            bgColor="#FFF9E6"
            onPress={() => router.push('/shop')}
          />
          <ActionCard
            icon="rocket"
            label="Invest"
            color="#1CB0F6"
            bgColor="#E6F4FF"
            onPress={() => router.push('/invest')}
          />
        </View>

        {/* Savings Goal */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Savings Goal</Text>
          <Pressable><Text style={styles.seeAllText}>See All</Text></Pressable>
        </View>
        <Pressable
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/savings-journey');
          }}
        >
          <GameCard style={styles.goalCardContainer}>
            <View style={styles.goalCardMain}>
              <View style={styles.goalIconBox}>
                <Ionicons name="bicycle" size={28} color="#FF9600" />
              </View>
              <View style={styles.goalDetail}>
                <View style={styles.goalTopRow}>
                  <Text style={styles.goalName}>New Bike</Text>
                  <Text style={styles.goalProgressText}>₹80 / ₹150</Text>
                </View>
                <View style={styles.goalTrack}>
                  <View style={[styles.goalFill, { width: '53%' }]} />
                </View>
              </View>
            </View>

            <View style={styles.goalQuoteBox}>
              <Ionicons name="sparkles" size={14} color="#FF9600" />
              <Text style={styles.goalQuoteText}>You're halfway there! Keep it up!</Text>
            </View>
          </GameCard>
        </Pressable>

        {/* Streak Component */}
        <LinearGradient
          colors={['#FF8800', '#FF5500']}
          style={styles.streakBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.streakLeft}>
            <View style={styles.streakIconCircle}>
              <Ionicons name="flame" size={24} color="#FF4B4B" />
            </View>
            <View>
              <Text style={styles.streakTitle}>7 Day Streak!</Text>
              <Text style={styles.streakSubtitle}>Earned +10 coins today</Text>
            </View>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakLevelText}>Level 5</Text>
          </View>
        </LinearGradient>

        <View style={{ height: 16 }} />



        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ActionCard = ({ icon, label, color, bgColor, onPress }: { icon: any, label: string, color: string, bgColor: string, onPress: () => void }) => (
  <Pressable
    style={({ pressed }) => [
      styles.actionCardWrapper,
      { transform: [{ scale: pressed ? 0.95 : 1 }] }
    ]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}
  >
    <View style={[styles.actionCard, { backgroundColor: 'white' }]}>
      <View style={[styles.actionIconBox, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  </Pressable>
);

const IconButton = ({ children, onPress, style }: { children: React.ReactNode, onPress: () => void, style?: any }) => (
  <Pressable
    style={({ pressed }) => [
      style,
      { transform: [{ scale: pressed ? 0.92 : 1 }], opacity: pressed ? 0.8 : 1 }
    ]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }}
  >
    {children}
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8FBFF',
  },
  whiteBg: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff2c2cff',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  textColumn: {
    gap: 2,
  },
  levelTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8B8B8B',
    letterSpacing: 0.5,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  notifButton: {
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
  notifBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4B4B',
    borderWidth: 2,
    borderColor: 'white',
  },
  savingsCard: {
    padding: 30,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  savingsLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#46A302',
    letterSpacing: 1,
    marginBottom: 8,
    opacity: 0.8,
  },
  savingsAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 20,
  },
  addMoneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  addMoneyText: {
    fontSize: 14,
    fontWeight: '900',
    color: 'white',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFB800',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCardWrapper: {
    flex: 1,
  },
  actionCard: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 32,
    borderBottomWidth: 6,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  goalCardContainer: {
    padding: 16,
    borderRadius: 32,
    marginBottom: 24,
  },
  goalCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  goalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#FFF4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalDetail: {
    flex: 1,
    gap: 10,
  },
  goalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  goalName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B6914',
    opacity: 0.8,
  },
  goalTrack: {
    height: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: 6,
  },
  goalQuoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  goalQuoteText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#8B4513',
  },
  doodleContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  doodleIcon1: {
    position: 'absolute',
    top: 10,
    left: 20,
    transform: [{ rotate: '15deg' }],
  },
  doodleIcon2: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    transform: [{ rotate: '-10deg' }],
  },
  doodleIcon3: {
    position: 'absolute',
    top: 40,
    right: 20,
    transform: [{ rotate: '25deg' }],
  },
  doodleIcon4: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    transform: [{ rotate: '-20deg' }],
  },
  doodleIcon5: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    transform: [{ rotate: '5deg' }],
  },
  doodleIcon6: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    transform: [{ rotate: '30deg' }],
  },
  doodleIcon7: {
    position: 'absolute',
    top: '50%',
    left: 10,
    transform: [{ rotate: '-45deg' }],
  },
  doodleIcon8: {
    position: 'absolute',
    top: '15%',
    right: '40%',
    transform: [{ rotate: '10deg' }],
  },
  doodleIcon9: {
    position: 'absolute',
    bottom: '40%',
    right: 15,
    transform: [{ rotate: '-15deg' }],
  },
  doodleIcon10: {
    position: 'absolute',
    top: 50,
    left: '25%',
    transform: [{ rotate: '20deg' }],
  },
  tipContainer: {
    padding: 10,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF9600',
  },
  streakBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderRadius: 32,
    marginBottom: 0,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  streakSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  streakLevelText: {
    fontSize: 12,
    fontWeight: '900',
    color: 'white',
  },
  avatarMainContainer: {
    position: 'relative',
  },
  avatarLevelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFB800',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarLevelText: {
    fontSize: 10,
    fontWeight: '900',
    color: 'white',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderBottomWidth: 4,
    borderColor: '#F0F0F0',
  },
  activityIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B8B8B',
  },
  activityXp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activityXpText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFB800',
  },
  tipCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderBottomWidth: 4,
    borderColor: '#F0F0F0',
  },
  tipIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 6,
  },
  tipDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B8B8B',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 120,
  },
});