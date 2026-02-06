import { CustomPopup } from '@/components/ui/CustomPopup';
import { GameCard } from '@/components/ui/game-card';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
    FadeInDown
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, Path, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Stock data
const STOCKS = {
    'tech': {
        id: 'tech',
        name: 'Tech Rocket',
        symbol: 'TECH',
        icon: 'hardware-chip',
        color: '#1CB0F6',
        bgColor: '#D8E5FF',
        price: 152.00,
        change: 12.4,
        changeAmount: 16.80,
        marketCap: '₹1.2Cr',
        volume: '₹45L',
        high52: '₹180',
        low52: '₹95',
        description: 'A high-growth technology company focused on AI and cloud computing solutions.',
        trend: [98, 105, 102, 115, 108, 125, 118, 135, 128, 145, 138, 150, 152],
    },
    'energy': {
        id: 'energy',
        name: 'Energy Shield',
        symbol: 'ENER',
        icon: 'leaf',
        color: '#46A302',
        bgColor: '#E6F7D6',
        price: 85.00,
        change: 4.2,
        changeAmount: 3.42,
        marketCap: '₹85L',
        volume: '₹12L',
        high52: '₹95',
        low52: '₹62',
        description: 'A sustainable energy company investing in solar and wind power solutions.',
        trend: [62, 65, 68, 72, 70, 75, 78, 80, 82, 81, 84, 85, 85],
    },
    'toy': {
        id: 'toy',
        name: 'Toy Factory',
        symbol: 'TOYS',
        icon: 'happy',
        color: '#FF4B4B',
        bgColor: '#FFE1E9',
        price: 54.00,
        change: -2.1,
        changeAmount: -1.16,
        marketCap: '₹32L',
        volume: '₹5L',
        high52: '₹72',
        low52: '₹48',
        description: 'A traditional toy manufacturing company adapting to digital gaming trends.',
        trend: [68, 65, 62, 58, 60, 55, 52, 54, 51, 53, 50, 52, 54],
    },
};

// Chart period data generation
// Chart period data generation
const getTrendForPeriod = (baseTrend: number[], period: string) => {
    const jitter = (range = 2) => (Math.random() - 0.5) * range;
    const base = [...baseTrend];

    switch (period) {
        case '1D':
            // 6 points for a granular day view
            const last = base[base.length - 1];
            return [last - 2, last - 1, last + jitter(4), last + jitter(2), last + 1, last + jitter(1)];
        case '1W':
            // 10 points with noise
            return base.slice(-10).map(v => v + jitter(3));
        case '1M':
            // The standard trend
            return base.map(v => v + jitter(1));
        case '3M':
            // 20 points, more volatile
            return Array.from({ length: 20 }, (_, i) => {
                const idx = Math.floor((i / 19) * (base.length - 1));
                return base[idx] * (0.95 + Math.random() * 0.1) + jitter(5);
            });
        case '1Y':
            // 30 points, long term growth/decay
            return Array.from({ length: 30 }, (_, i) => {
                const idx = Math.floor((i / 29) * (base.length - 1));
                return base[idx] * (0.8 + (i / 30) * 0.4) + jitter(8);
            });
        default:
            return base;
    }
};

// Chart component
const StockChart = ({ data, color, width: chartWidth, height: chartHeight }: {
    data: number[],
    color: string,
    width: number,
    height: number
}) => {
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const graphWidth = chartWidth - padding.left - padding.right;
    const graphHeight = chartHeight - padding.top - padding.bottom;

    const min = Math.min(...data) * 0.95;
    const max = Math.max(...data) * 1.05;
    const range = max - min;

    // Generate path
    const points = data.map((val, i) => {
        const x = padding.left + (i / (data.length - 1)) * graphWidth;
        const y = padding.top + graphHeight - ((val - min) / range) * graphHeight;
        return { x, y };
    });

    const linePath = points.reduce((path, point, i) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        return `${path} L ${point.x},${point.y}`;
    }, '');

    const areaPath = `${linePath} L ${points[points.length - 1].x},${padding.top + graphHeight} L ${points[0].x},${padding.top + graphHeight} Z`;

    // Y-axis labels
    const yLabels = [min, min + range * 0.5, max];

    return (
        <Svg width={chartWidth} height={chartHeight}>
            <Defs>
                <SvgLinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={color} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={color} stopOpacity="0" />
                </SvgLinearGradient>
            </Defs>

            {/* Grid lines */}
            {yLabels.map((label, i) => {
                const y = padding.top + graphHeight - (i * graphHeight / 2);
                return (
                    <React.Fragment key={i}>
                        <Line
                            x1={padding.left}
                            y1={y}
                            x2={chartWidth - padding.right}
                            y2={y}
                            stroke="#E5E5E5"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                        />
                        <SvgText
                            x={padding.left - 10}
                            y={y + 4}
                            fill="#8B8B8B"
                            fontSize="10"
                            textAnchor="end"
                        >
                            ₹{label.toFixed(0)}
                        </SvgText>
                    </React.Fragment>
                );
            })}

            {/* Area fill */}
            <Path d={areaPath} fill="url(#areaGradient)" />

            {/* Line */}
            <Path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Current price dot */}
            <Circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="6"
                fill="white"
                stroke={color}
                strokeWidth="3"
            />
        </Svg>
    );
};

export default function StockDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { gameState, buyStock, sellStock } = useGame();
    const { player } = gameState;

    const stockId = (params.id as string) || 'tech';
    const stock = STOCKS[stockId as keyof typeof STOCKS] || STOCKS.tech;

    const [selectedPeriod, setSelectedPeriod] = useState('1M');
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [quantity, setQuantity] = useState('1');
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupData, setPopupData] = useState<{
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
    }>({ type: 'info', title: '', message: '' });

    const showPopup = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setPopupData({ type, title, message });
        setPopupVisible(true);
    };

    // Get holdings from global state
    const currentHolding = player.stocks[stockId] || { quantity: 0, avgPrice: 0 };
    const holdings = currentHolding.quantity;
    const [livePrice, setLivePrice] = useState(stock.price);
    const [chartData, setChartData] = useState(stock.trend);

    const periods = ['1D', '1W', '1M', '3M', '1Y'];
    const isPositive = stock.change >= 0;

    // Live price simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const jitter = (Math.random() - 0.5) * 0.5;
            setLivePrice(prev => {
                const newPrice = prev + jitter;
                return Math.max(newPrice, stock.price * 0.5);
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [stock.price]);

    // Period switcher
    useEffect(() => {
        setChartData(getTrendForPeriod(stock.trend, selectedPeriod));
    }, [selectedPeriod, stock.trend]);

    const handleBuy = () => {
        const qty = parseInt(quantity) || 0;
        const totalCost = qty * livePrice;

        if (totalCost > player.money) {
            showPopup('error', 'Insufficient Funds', 'You don\'t have enough money for this purchase.');
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        buyStock(stockId, qty, livePrice);
        setShowBuyModal(false);
        setQuantity('1');

        showPopup(
            'success',
            'Purchase Successful',
            `You bought ${qty} shares of ${stock.symbol} for ₹${totalCost.toFixed(2)}`
        );
    };

    const handleSell = () => {
        const qty = parseInt(quantity) || 0;

        if (qty > holdings) {
            showPopup('error', 'Insufficient Holdings', 'You don\'t have enough shares to sell.');
            return;
        }

        const totalValue = qty * livePrice;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        sellStock(stockId, qty, livePrice);
        setShowSellModal(false);
        setQuantity('1');

        showPopup(
            'success',
            'Sale Successful',
            `You sold ${qty} shares of ${stock.symbol} for ₹${totalValue.toFixed(2)}`
        );
    };

    return (
        <View style={styles.container}>
            <ScreenWrapper>
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
                        <View style={styles.headerCenter}>
                            <View style={[styles.stockIconSmall, { backgroundColor: stock.bgColor }]}>
                                <Ionicons name={stock.icon as any} size={20} color={stock.color} />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>{stock.symbol}</Text>
                                <Text style={styles.headerSubtitle}>{stock.name}</Text>
                            </View>
                        </View>
                        <Pressable
                            style={({ pressed }) => [styles.moreBtn, { opacity: pressed ? 0.6 : 1 }]}
                        >
                            <Ionicons name="star-outline" size={24} color="#FFB800" />
                        </Pressable>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                        {/* Price Card */}
                        <Animated.View entering={FadeInDown.delay(100)}>
                            <View style={styles.priceCard}>
                                <View style={styles.liveIndicatorRow}>
                                    <View style={styles.liveDot} />
                                    <Text style={styles.liveText}>LIVE</Text>
                                </View>
                                <Text style={styles.currentPrice}>₹{livePrice.toFixed(2)}</Text>
                                <View style={[
                                    styles.changeBadge,
                                    { backgroundColor: isPositive ? '#E8F5E9' : '#FFEBEE' }
                                ]}>
                                    <Ionicons
                                        name={isPositive ? 'trending-up' : 'trending-down'}
                                        size={16}
                                        color={isPositive ? '#46A302' : '#FF4B4B'}
                                    />
                                    <Text style={[
                                        styles.changeText,
                                        { color: isPositive ? '#46A302' : '#FF4B4B' }
                                    ]}>
                                        {isPositive ? '+' : ''}{stock.change}% (₹{Math.abs(stock.changeAmount).toFixed(2)})
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>

                        {/* Chart */}
                        <Animated.View entering={FadeInDown.delay(200)}>
                            <GameCard style={styles.chartCard}>
                                <StockChart
                                    key={selectedPeriod}
                                    data={chartData}
                                    color={stock.color}
                                    width={width - 60}
                                    height={200}
                                />

                                {/* Period Selector */}
                                <View style={styles.periodRow}>
                                    {periods.map((period) => (
                                        <Pressable
                                            key={period}
                                            style={[
                                                styles.periodBtn,
                                                selectedPeriod === period && { backgroundColor: stock.color }
                                            ]}
                                            onPress={() => setSelectedPeriod(period)}
                                        >
                                            <Text style={[
                                                styles.periodText,
                                                selectedPeriod === period && styles.periodTextActive
                                            ]}>
                                                {period}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </GameCard>
                        </Animated.View>

                        {/* Holdings Card */}
                        {holdings > 0 && (
                            <Animated.View entering={FadeInDown.delay(250)}>
                                <LinearGradient
                                    colors={[stock.color, stock.color + 'DD']}
                                    style={styles.holdingsCard}
                                >
                                    <View>
                                        <Text style={styles.holdingsLabel}>YOUR HOLDINGS</Text>
                                        <Text style={styles.holdingsValue}>{holdings} shares</Text>
                                    </View>
                                    <View style={styles.holdingsRight}>
                                        <Text style={styles.holdingsTotal}>₹{(holdings * livePrice).toFixed(2)}</Text>
                                        <Text style={styles.holdingsGain}>
                                            {livePrice >= currentHolding.avgPrice ? '+' : ''}
                                            ₹{((livePrice - currentHolding.avgPrice) * holdings).toFixed(2)} total profit
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </Animated.View>
                        )}

                        {/* Stats Grid */}
                        <Animated.View entering={FadeInDown.delay(300)}>
                            <Text style={styles.sectionTitle}>Key Statistics</Text>
                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Market Cap</Text>
                                    <Text style={styles.statValue}>{stock.marketCap}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Volume</Text>
                                    <Text style={styles.statValue}>{stock.volume}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>52W High</Text>
                                    <Text style={styles.statValue}>{stock.high52}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>52W Low</Text>
                                    <Text style={styles.statValue}>{stock.low52}</Text>
                                </View>
                            </View>
                        </Animated.View>

                        {/* About */}
                        <Animated.View entering={FadeInDown.delay(400)}>
                            <Text style={styles.sectionTitle}>About {stock.name}</Text>
                            <GameCard style={styles.aboutCard}>
                                <Text style={styles.aboutText}>{stock.description}</Text>
                            </GameCard>
                        </Animated.View>

                        {/* Investment Tip */}
                        <Animated.View entering={FadeInDown.delay(500)}>
                            <View style={styles.tipCard}>
                                <View style={styles.tipIcon}>
                                    <Ionicons name="bulb" size={24} color="#F59E0B" />
                                </View>
                                <View style={styles.tipContent}>
                                    <Text style={styles.tipTitle}>Investment Tip 💡</Text>
                                    <Text style={styles.tipText}>
                                        {isPositive
                                            ? "This stock is performing well! Consider if it fits your long-term goals."
                                            : "This stock is down. It might be a buying opportunity, but research carefully!"}
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>

                        <View style={{ height: 150 }} />
                    </ScrollView>

                    {/* Bottom Action Buttons */}
                    <View style={styles.bottomActions}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.sellBtn,
                                { transform: [{ scale: pressed ? 0.96 : 1 }] },
                                holdings === 0 && styles.disabledBtn
                            ]}
                            onPress={() => holdings > 0 && setShowSellModal(true)}
                            disabled={holdings === 0}
                        >
                            <Ionicons name="trending-down" size={22} color={holdings > 0 ? '#FF4B4B' : '#AFAFAF'} />
                            <Text style={[styles.sellBtnText, holdings === 0 && styles.disabledText]}>SELL</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.buyBtn,
                                { transform: [{ scale: pressed ? 0.96 : 1 }] }
                            ]}
                            onPress={() => setShowBuyModal(true)}
                        >
                            <Ionicons name="trending-up" size={22} color="white" />
                            <Text style={styles.buyBtnText}>BUY</Text>
                        </Pressable>
                    </View>

                </SafeAreaView>

                {/* Buy Modal */}
                <Modal
                    visible={showBuyModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowBuyModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Buy {stock.symbol}</Text>
                                <Pressable onPress={() => setShowBuyModal(false)}>
                                    <Ionicons name="close" size={28} color="#1F1F1F" />
                                </Pressable>
                            </View>

                            <View style={styles.stockInfo}>
                                <View style={[styles.stockIconLarge, { backgroundColor: stock.bgColor }]}>
                                    <Ionicons name={stock.icon as any} size={32} color={stock.color} />
                                </View>
                                <View>
                                    <Text style={styles.stockName}>{stock.name}</Text>
                                    <Text style={styles.stockPrice}>₹{livePrice.toFixed(2)} per share</Text>
                                </View>
                            </View>

                            <Text style={styles.inputLabel}>Quantity</Text>
                            <View style={styles.quantityRow}>
                                <Pressable
                                    style={styles.quantityBtn}
                                    onPress={() => setQuantity(prev => Math.max(1, parseInt(prev) - 1).toString())}
                                >
                                    <Ionicons name="remove" size={24} color="#1F1F1F" />
                                </Pressable>
                                <TextInput
                                    style={styles.quantityInput}
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="number-pad"
                                    textAlign="center"
                                />
                                <Pressable
                                    style={styles.quantityBtn}
                                    onPress={() => setQuantity(prev => (parseInt(prev) + 1).toString())}
                                >
                                    <Ionicons name="add" size={24} color="#1F1F1F" />
                                </Pressable>
                            </View>

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total Cost</Text>
                                <Text style={styles.totalValue}>₹{((parseInt(quantity) || 0) * livePrice).toFixed(2)}</Text>
                            </View>

                            <View style={styles.balanceRow}>
                                <Text style={styles.balanceLabel}>Available Balance</Text>
                                <Text style={styles.balanceValue}>₹{player.money.toFixed(2)}</Text>
                            </View>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.confirmBuyBtn,
                                    { transform: [{ scale: pressed ? 0.96 : 1 }] }
                                ]}
                                onPress={handleBuy}
                            >
                                <Text style={styles.confirmBtnText}>Confirm Purchase</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* Sell Modal */}
                <Modal
                    visible={showSellModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowSellModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Sell {stock.symbol}</Text>
                                <Pressable onPress={() => setShowSellModal(false)}>
                                    <Ionicons name="close" size={28} color="#1F1F1F" />
                                </Pressable>
                            </View>

                            <View style={styles.stockInfo}>
                                <View style={[styles.stockIconLarge, { backgroundColor: stock.bgColor }]}>
                                    <Ionicons name={stock.icon as any} size={32} color={stock.color} />
                                </View>
                                <View>
                                    <Text style={styles.stockName}>{stock.name}</Text>
                                    <Text style={styles.stockPrice}>₹{livePrice.toFixed(2)} per share</Text>
                                </View>
                            </View>

                            <Text style={styles.inputLabel}>Quantity (You own {holdings})</Text>
                            <View style={styles.quantityRow}>
                                <Pressable
                                    style={styles.quantityBtn}
                                    onPress={() => setQuantity(prev => Math.max(1, parseInt(prev) - 1).toString())}
                                >
                                    <Ionicons name="remove" size={24} color="#1F1F1F" />
                                </Pressable>
                                <TextInput
                                    style={styles.quantityInput}
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="number-pad"
                                    textAlign="center"
                                />
                                <Pressable
                                    style={styles.quantityBtn}
                                    onPress={() => setQuantity(prev => Math.min(holdings, parseInt(prev) + 1).toString())}
                                >
                                    <Ionicons name="add" size={24} color="#1F1F1F" />
                                </Pressable>
                            </View>

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>You'll Receive</Text>
                                <Text style={[styles.totalValue, { color: '#46A302' }]}>
                                    ₹{((parseInt(quantity) || 0) * livePrice).toFixed(2)}
                                </Text>
                            </View>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.confirmSellBtn,
                                    { transform: [{ scale: pressed ? 0.96 : 1 }] }
                                ]}
                                onPress={handleSell}
                            >
                                <Text style={styles.confirmBtnText}>Confirm Sale</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <CustomPopup
                    visible={popupVisible}
                    onClose={() => setPopupVisible(false)}
                    type={popupData.type}
                    title={popupData.title}
                    message={popupData.message}
                />
            </ScreenWrapper>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stockIconSmall: {
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    moreBtn: {
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
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    priceCard: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    liveIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 6,
        marginBottom: 8,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF4B4B',
    },
    liveText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#FF4B4B',
        letterSpacing: 1,
    },
    currentPrice: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        gap: 6,
        marginTop: 8,
    },
    changeText: {
        fontSize: 16,
        fontWeight: '900',
    },
    chartCard: {
        padding: 20,
        borderRadius: 28,
        marginBottom: 16,
    },
    periodRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    periodBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#8B8B8B',
    },
    periodTextActive: {
        color: 'white',
    },
    holdingsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
    },
    holdingsLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
    },
    holdingsValue: {
        fontSize: 24,
        fontWeight: '900',
        color: 'white',
    },
    holdingsRight: {
        alignItems: 'flex-end',
    },
    holdingsTotal: {
        fontSize: 20,
        fontWeight: '900',
        color: 'white',
    },
    holdingsGain: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 16,
        marginTop: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    statItem: {
        width: (width - 52) / 2,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B8B8B',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    aboutCard: {
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
    },
    aboutText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
        lineHeight: 24,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF9E6',
        padding: 20,
        borderRadius: 24,
        gap: 16,
        borderWidth: 2,
        borderColor: '#FFE0A3',
    },
    tipIcon: {
        marginTop: 2,
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
    tipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B6914',
        lineHeight: 20,
    },
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    sellBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        backgroundColor: '#FFE6E6',
        gap: 8,
        borderWidth: 2,
        borderColor: '#FFD0D0',
    },
    sellBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#FF4B4B',
    },
    buyBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        backgroundColor: '#58CC02',
        gap: 8,
        borderBottomWidth: 4,
        borderColor: '#46A302',
    },
    buyBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    disabledBtn: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E5E5E5',
    },
    disabledText: {
        color: '#AFAFAF',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
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
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    stockInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#F8F8F8',
        borderRadius: 20,
    },
    stockIconLarge: {
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stockName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    stockPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B8B8B',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B8B8B',
        marginBottom: 12,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    quantityBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: '900',
        color: '#1F1F1F',
        backgroundColor: '#F5F5F5',
        paddingVertical: 16,
        borderRadius: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 24,
    },
    balanceLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#AFAFAF',
    },
    balanceValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B8B8B',
    },
    confirmBuyBtn: {
        backgroundColor: '#58CC02',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderColor: '#46A302',
    },
    confirmSellBtn: {
        backgroundColor: '#FF4B4B',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderColor: '#D33131',
    },
    confirmBtnText: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
    },
});
