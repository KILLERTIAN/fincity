import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    colors?: readonly [string, string, ...string[]];
}

const FloatingIcon = ({ name, size, color, top, left, delay = 0 }: any) => {
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);

    React.useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                withTiming(15, { duration: 2500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        rotation.value = withRepeat(
            withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { rotate: `${rotation.value}deg` }
        ],
        opacity: 0.15,
    }));

    return (
        <Animated.View style={[styles.floatingIcon, { top, left }, animatedStyle]}>
            <Ionicons name={name} size={size} color={color} />
        </Animated.View>
    );
};

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style, colors }) => {
    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isLargeScreen = width > 768;

    return (
        <View style={isWeb && isLargeScreen ? styles.webContainer : styles.container}>
            {/* Background Layer - Always behind content */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={colors || ['#F0F9EB', '#F7FDF4', '#FFFFFF']}
                    style={StyleSheet.absoluteFill}
                />

                {/* Background Decorative Icons */}
                <View style={styles.backgroundLayer}>
                    <FloatingIcon name="cash-outline" size={Math.min(width * 0.08, 40)} color="#58CC02" top="10%" left="5%" />
                    <FloatingIcon name="stats-chart-outline" size={Math.min(width * 0.1, 50)} color="#1CB0F6" top="25%" left="15%" />
                    <FloatingIcon name="wallet-outline" size={Math.min(width * 0.07, 35)} color="#FFB800" top="60%" left="8%" />
                    <FloatingIcon name="trending-up-outline" size={Math.min(width * 0.09, 45)} color="#46A302" top="80%" left="12%" />

                    <FloatingIcon name="diamond-outline" size={Math.min(width * 0.08, 42)} color="#1CB0F6" top="15%" left="85%" />
                    <FloatingIcon name="pie-chart-outline" size={Math.min(width * 0.1, 50)} color="#FF4B4B" top="40%" left="80%" />
                    <FloatingIcon name="bag-handle-outline" size={Math.min(width * 0.09, 45)} color="#FFD700" top="70%" left="88%" />
                    <FloatingIcon name="card-outline" size={Math.min(width * 0.07, 35)} color="#2196F3" top="5%" left="75%" />
                </View>
            </View>

            {isWeb && isLargeScreen ? (
                <View style={[styles.webInner, style]}>
                    {children}
                </View>
            ) : (
                <View style={[styles.flex, style]}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    flex: {
        flex: 1,
    },
    webAlign: {
        alignItems: 'center',
        overflow: 'hidden',
    },
    webContainer: {
        flex: 1,
        backgroundColor: '#F0F9EB',
        alignItems: 'center',
        overflow: 'hidden',
        // Ensure gradient covers entire screen including status bar area
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    webInner: {
        width: '100%',
        maxWidth: 768, // Restored to original width
        backgroundColor: '#FFFFFF',
        flex: 1,
        shadowColor: '#1CB0F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#E1F0FF',
        zIndex: 1,
    },
    floatingIcon: {
        position: 'absolute',
        zIndex: 0,
    }
});

