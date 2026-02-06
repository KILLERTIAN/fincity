import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Svg, { G, Polygon, Polyline, Rect } from 'react-native-svg';
import { IsometricBuilding } from './IsometricBuildings';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Building types with their properties
export interface Building {
    id: string;
    name: string;
    type: 'home' | 'guild' | 'store' | 'market' | 'bank' | 'park' | 'lake' | 'hospital' | 'police' | 'gym' | 'bush' | 'streetlight' | 'trafficLight';
    icon?: keyof typeof Ionicons.glyphMap;
    color: string;
    gridX: number;
    gridY: number;
    width?: number;
    height?: number;
    description?: string;
    isDecoration?: boolean;
    direction?: 'up' | 'down' | 'left' | 'right';
}

const TILE_WIDTH = 24;
const TILE_HEIGHT = 12;
const GRID_SIZE = 52;

// Convert grid coordinates to isometric screen coordinates
const gridToIso = (gridX: number, gridY: number) => {
    const isoX = (gridX - gridY) * (TILE_WIDTH / 2);
    const isoY = (gridX + gridY) * (TILE_HEIGHT / 2);
    return { x: isoX, y: isoY };
};

// Default buildings layout - Organized City Grid
const DEFAULT_BUILDINGS: Building[] = [
    // Top-Left Quadrant (Residential & Services)
    { id: '1', name: 'Police HQ', type: 'police', icon: 'shield', color: '#1E88E5', gridX: 4, gridY: 4, width: 6, height: 6, description: 'Protecting the digital city.' },
    { id: '2', name: 'Lake Side', type: 'lake', icon: 'water', color: '#4FC3F7', gridX: 4, gridY: 16, width: 6, height: 6, description: 'Relax by the water.' },

    // Top-Right Quadrant (Commercial)
    { id: '3', name: 'Sky Bank', type: 'bank', icon: 'wallet', color: '#1CB0F6', gridX: 16, gridY: 4, width: 8, height: 8, description: 'Secure assets in the clouds.' },
    { id: '4', name: 'Coffee House', type: 'store', icon: 'cafe', color: '#795548', gridX: 26, gridY: 4, width: 5, height: 5, description: 'Best brew in the city.' },

    // Center-Left (Public Spaces)
    { id: '5', name: 'Civic Park', type: 'park', icon: 'leaf', color: '#8BC34A', gridX: 4, gridY: 28, width: 8, height: 8, description: 'A green lung for the city.' },
    { id: '6', name: 'Metro Gym', type: 'gym', icon: 'fitness', color: '#E91E63', gridX: 4, gridY: 40, width: 6, height: 6, description: 'Premium fitness and recovery.' },

    // Center (Main District)
    { id: '7', name: 'Elite Office', type: 'guild', icon: 'business', color: '#6C5CE7', gridX: 16, gridY: 28, width: 10, height: 10, description: 'The hub of tech innovation.' },
    { id: '8', name: 'City Hospital', type: 'hospital', icon: 'medical', color: '#FF5252', gridX: 28, gridY: 28, width: 8, height: 8, description: 'Advanced healthcare for all.' },

    // Bottom-Right Quadrant
    { id: '9', name: 'Apartment A', type: 'home', icon: 'home', color: '#4CAF50', gridX: 16, gridY: 40, width: 7, height: 7, description: 'Luxury living with a view.' },
    { id: '10', name: 'Shopping Mall', type: 'market', icon: 'cart', color: '#FF9800', gridX: 28, gridY: 40, width: 8, height: 8, description: 'Everything you need.' },

    // Decorative elements
    { id: 'st1', name: '', type: 'streetlight', color: '#FFD54F', gridX: 13, gridY: 13, isDecoration: true, width: 1, height: 1 },
    { id: 'st2', name: '', type: 'streetlight', color: '#FFD54F', gridX: 38, gridY: 13, isDecoration: true, width: 1, height: 1 },
    { id: 'st3', name: '', type: 'streetlight', color: '#FFD54F', gridX: 13, gridY: 38, isDecoration: true, width: 1, height: 1 },
    { id: 'st4', name: '', type: 'streetlight', color: '#FFD54F', gridX: 38, gridY: 38, isDecoration: true, width: 1, height: 1 },
    { id: 'st5', name: '', type: 'streetlight', color: '#FFD54F', gridX: 25, gridY: 25, isDecoration: true, width: 1, height: 1 },
];
interface CityMapProps {
    buildings?: Building[];
    onBuildingSelect?: (building: Building) => void;
    playerPosition?: { gridX: number; gridY: number };
}

export const CityMapEnhanced: React.FC<CityMapProps> = ({
    buildings = DEFAULT_BUILDINGS,
    onBuildingSelect,
    playerPosition = { gridX: 2, gridY: 2 },
}) => {
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

    // Center the map properly on initial load
    const mapWidth = GRID_SIZE * TILE_WIDTH;
    const mapHeight = GRID_SIZE * TILE_HEIGHT;
    const initialScale = 0.6;

    const initialX = (SCREEN_WIDTH - mapWidth * initialScale) / 2;
    const initialY = (SCREEN_HEIGHT - mapHeight * initialScale) / 2;

    const [pan] = useState(new Animated.ValueXY({ x: initialX, y: initialY }));
    const [scale] = useState(new Animated.Value(initialScale));

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            pan.setOffset({
                x: (pan.x as any)._value,
                y: (pan.y as any)._value,
            });
            pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (e, gestureState) => {
            const currentScale = (scale as any)._value;
            const contentWidth = GRID_SIZE * TILE_WIDTH * currentScale;
            const contentHeight = GRID_SIZE * TILE_HEIGHT * currentScale;

            const newX = (pan.x as any)._offset + gestureState.dx;
            const newY = (pan.y as any)._offset + gestureState.dy;

            // Tight clamping: Keep the map centered and prevent scrolling into the grey void
            const margin = 200 * currentScale;

            // Content edges in screen space
            const leftEdge = newX;
            const rightEdge = newX + contentWidth;
            const topEdge = newY;
            const bottomEdge = newY + contentHeight;

            // Clamped values
            let clampedX = gestureState.dx;
            let clampedY = gestureState.dy;

            // Simple clamp: don't let edges cross screen center too much
            const centerX = SCREEN_WIDTH / 2;
            const centerY = SCREEN_HEIGHT / 2;

            if (newX > centerX + margin) clampedX = (centerX + margin) - (pan.x as any)._offset;
            if (newX + contentWidth < centerX - margin) clampedX = (centerX - margin - contentWidth) - (pan.x as any)._offset;

            if (newY > centerY + margin) clampedY = (centerY + margin) - (pan.y as any)._offset;
            if (newY + contentHeight < centerY - margin) clampedY = (centerY - margin - contentHeight) - (pan.y as any)._offset;

            pan.x.setValue(clampedX);
            pan.y.setValue(clampedY);
        },
        onPanResponderRelease: () => {
            pan.flattenOffset();
        },
    });

    const handleBuildingPress = (building: Building) => {
        if (building.isDecoration) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedBuilding(building);
        onBuildingSelect?.(building);
    };

    const getTileType = (gridX: number, gridY: number) => {
        // Main road grid - creates a proper city block system
        const isMainRoad =
            // Vertical roads
            (gridX >= 12 && gridX <= 14) || // Left vertical
            (gridX >= 24 && gridX <= 26) || // Center vertical
            (gridX >= 36 && gridX <= 38) || // Right vertical
            // Horizontal roads
            (gridY >= 12 && gridY <= 14) || // Top horizontal
            (gridY >= 24 && gridY <= 26) || // Center horizontal
            (gridY >= 36 && gridY <= 38);   // Bottom horizontal

        if (isMainRoad) return 'road';

        // Sidewalks (thin borders around roads)
        const isSidewalk =
            (gridX === 11 || gridX === 15 || gridX === 23 || gridX === 27 || gridX === 35 || gridX === 39) ||
            (gridY === 11 || gridY === 15 || gridY === 23 || gridY === 27 || gridY === 35 || gridY === 39);

        if (isSidewalk) return 'sidewalk';

        // Building plots
        const isPlot = buildings.some((b: Building) =>
            !b.isDecoration &&
            gridX >= b.gridX && gridX < b.gridX + (b.width || 1) &&
            gridY >= b.gridY && gridY < b.gridY + (b.height || 1)
        );
        if (isPlot) return 'plot';

        return 'grass';
    };



    const renderIsometricTile = (gridX: number, gridY: number, key: string) => {
        const { x, y } = gridToIso(gridX, gridY);
        const type = getTileType(gridX, gridY);
        const isLight = (gridX + gridY) % 2 === 0;

        let topColor, leftColor, rightColor;

        switch (type) {
            case 'road':
                topColor = isLight ? '#99AAB5' : '#8A99A3';
                leftColor = '#727E87';
                rightColor = '#5C666E';
                break;
            case 'sidewalk':
                topColor = isLight ? '#E7EBF0' : '#DDE3EA';
                leftColor = '#BCC8D1';
                rightColor = '#ACB9C2';
                break;
            case 'plot': // Developed land - slightly neater lawn
                topColor = isLight ? '#8BC34A' : '#7CB342';
                leftColor = '#689F38';
                rightColor = '#558B2F';
                break;
            case 'grass': // Wild grass - standard
            default:
                topColor = isLight ? '#9CCC65' : '#8BC34A';
                leftColor = '#7CB342';
                rightColor = '#689F38';
                break;
        }

        const top = `${TILE_WIDTH / 2},0`;
        const right = `${TILE_WIDTH},${TILE_HEIGHT / 2}`;
        const bottom = `${TILE_WIDTH / 2},${TILE_HEIGHT}`;
        const left = `0,${TILE_HEIGHT / 2}`;

        return (
            <View
                key={key}
                style={[
                    styles.tile,
                    {
                        left: x,
                        top: y,
                        zIndex: 1,
                    },
                ]}
            >
                <Svg width={TILE_WIDTH} height={TILE_HEIGHT + 10}>
                    {/* Depth Side Faces */}
                    <Polygon
                        points={`0,${TILE_HEIGHT / 2} ${TILE_WIDTH / 2},${TILE_HEIGHT} ${TILE_WIDTH / 2},${TILE_HEIGHT + 4} 0,${TILE_HEIGHT / 2 + 4}`}
                        fill={leftColor}
                    />
                    <Polygon
                        points={`${TILE_WIDTH / 2},${TILE_HEIGHT} ${TILE_WIDTH},${TILE_HEIGHT / 2} ${TILE_WIDTH},${TILE_HEIGHT / 2 + 4} ${TILE_WIDTH / 2},${TILE_HEIGHT + 4}`}
                        fill={rightColor}
                    />
                    {/* Top Surface */}
                    <Polygon
                        points={`${top} ${right} ${bottom} ${left}`}
                        fill={topColor}
                        stroke="rgba(0, 0, 0, 0.15)"
                        strokeWidth="0.6"
                    />

                    {/* Subtle grid pattern for all tiles */}
                    <G opacity="0.15">
                        <Polyline points="0,20 40,40" stroke="white" strokeWidth="0.8" />
                        <Polyline points="40,40 80,20" stroke="white" strokeWidth="0.8" />
                    </G>

                    {/* Glossy top highlight */}
                    <Polygon
                        points={`0,${TILE_HEIGHT / 2} ${TILE_WIDTH / 2},0 5,${TILE_HEIGHT / 2 - 2}`}
                        fill="white"
                        opacity="0.1"
                    />

                    {/* Road Markings */}
                    {type === 'road' && (gridX === Math.floor(GRID_SIZE / 2) && gridY % 10 === 0) && (
                        <Rect x={TILE_WIDTH / 2 - 1} y={TILE_HEIGHT / 4} width={2} height={TILE_HEIGHT / 2} fill="white" opacity="0.3" />
                    )}
                </Svg>
            </View>
        );
    };

    const renderBuilding = (building: Building) => {
        const bW = building.width || 2;
        const bH = building.height || 2;

        // The visual width of a WxH footprint diamond is (W + H) * (TILE_WIDTH / 2)
        const footprintWidth = (bW + bH) * (TILE_WIDTH / 2);
        const footprintHeight = (bW + bH) * (TILE_HEIGHT / 2);

        // Building visual dimensions (Scale relative to footprint)
        const buildingWidth = footprintWidth * 1.5;
        const buildingHeight = footprintHeight + (bW * 8); // Taller buildings



        // Center of the building footprint
        const centerX = building.gridX + bW / 2;
        const centerY = building.gridY + bH / 2;
        const { x, y } = gridToIso(centerX, centerY);
        const isSelected = selectedBuilding?.id === building.id;

        return (
            <Pressable
                key={building.id}
                style={[
                    styles.building,
                    {
                        left: x - buildingWidth / 2,
                        top: y - buildingHeight + footprintHeight / 2, // Anchor point at bottom center of diamond
                        width: buildingWidth,
                        height: buildingHeight,
                        zIndex: 2000 + Math.floor(building.gridY + building.gridX),
                    },
                ]}
                onPress={() => handleBuildingPress(building)}
            >
                <Animated.View
                    style={[
                        {
                            width: '100%',
                            height: '100%',
                            transform: [{ scale: (isSelected && !building.isDecoration) ? 1.15 : 1 }],
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                >
                    {isSelected && !building.isDecoration && (
                        <View style={styles.selectionRing} />
                    )}

                    <IsometricBuilding
                        type={building.type}
                        width={buildingWidth}
                        height={buildingHeight}
                        color={building.color}
                        direction={building.direction}
                    />

                    {!building.isDecoration && (
                        <View style={styles.labelTextContainer}>
                            <Text style={styles.labelText}>{building.name}</Text>
                        </View>
                    )}
                </Animated.View>
            </Pressable>
        );
    };

    const renderPlayer = () => {
        const { x, y } = gridToIso(playerPosition.gridX, playerPosition.gridY);

        return (
            <View
                style={[
                    styles.player,
                    {
                        left: x - 20 + TILE_WIDTH / 2,
                        top: y - 40 + TILE_HEIGHT / 2,
                        zIndex: 50,
                    },
                ]}
            >
                <View style={styles.playerContainer}>
                    <Ionicons name="person" size={32} color="white" />
                </View>
            </View>
        );
    };

    // Optimized Ground Rendering
    const MapGround = React.useMemo(() => {
        const gridTiles = [];
        // Add a base grass layer to cover gaps
        gridTiles.push(
            <Rect
                key="base-grass"
                x={-GRID_SIZE * TILE_WIDTH}
                y={-GRID_SIZE * TILE_HEIGHT}
                width={GRID_SIZE * TILE_WIDTH * 3}
                height={GRID_SIZE * TILE_HEIGHT * 3}
                fill="#8BC34A"
            />
        );

        for (let gridY = 0; gridY < GRID_SIZE; gridY++) {
            for (let gridX = 0; gridX < GRID_SIZE; gridX++) {
                const type = getTileType(gridX, gridY);
                if (type === 'grass') continue; // Use base layer for efficiency

                const { x, y } = gridToIso(gridX, gridY);
                const isLight = (gridX + gridY) % 2 === 0;

                let topColor;
                switch (type) {
                    case 'road': topColor = '#37474F'; break; // Darker slate for road
                    case 'sidewalk': topColor = '#B0BEC5'; break; // Light grey border
                    case 'plot': topColor = '#C5E1A5'; break; // Brighter plot green
                    default: topColor = '#9CCC65'; break; // Base grass
                }

                const points = `${x + TILE_WIDTH / 2},${y} ${x + TILE_WIDTH},${y + TILE_HEIGHT / 2} ${x + TILE_WIDTH / 2},${y + TILE_HEIGHT} ${x},${y + TILE_HEIGHT / 2}`;
                gridTiles.push(
                    <Polygon
                        key={`${gridX}-${gridY}`}
                        points={points}
                        fill={topColor}
                    />
                );

                // Add yellow dashed line markings for road centers
                if (type === 'road') {
                    const isVerticalRoad = (gridX >= 12 && gridX <= 14) || (gridX >= 24 && gridX <= 26) || (gridX >= 36 && gridX <= 38);
                    const isHorizontalRoad = (gridY >= 12 && gridY <= 14) || (gridY >= 24 && gridY <= 26) || (gridY >= 36 && gridY <= 38);

                    // Draw center line markings
                    if (isVerticalRoad && gridY % 3 === 0 && gridX === 13) {
                        gridTiles.push(
                            <Rect key={`mark-v-${gridX}-${gridY}`} x={x + TILE_WIDTH / 2 - 0.5} y={y + TILE_HEIGHT / 4} width={1} height={TILE_HEIGHT / 2} fill="#FFD54F" opacity="0.7" />
                        );
                    }
                    if (isHorizontalRoad && gridX % 3 === 0 && gridY === 13) {
                        gridTiles.push(
                            <Rect key={`mark-h-${gridX}-${gridY}`} x={x + TILE_WIDTH / 4} y={y + TILE_HEIGHT / 2 - 0.5} width={TILE_WIDTH / 2} height={1} fill="#FFD54F" opacity="0.7" />
                        );
                    }
                }
            }
        }

        return (
            <Svg width={GRID_SIZE * TILE_WIDTH} height={GRID_SIZE * TILE_HEIGHT} style={StyleSheet.absoluteFill}>
                {gridTiles}
            </Svg>
        );
    }, [buildings]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.mapContainer,
                    {
                        transform: [
                            { translateX: pan.x },
                            { translateY: pan.y },
                            { scale },
                        ],
                    },
                ]}
                {...panResponder.panHandlers}
            >
                <View style={{ position: 'absolute', top: 0, left: 0 }}>
                    {MapGround}
                </View>

                {buildings.map(renderBuilding)}
                {renderPlayer()}
            </Animated.View>

            {/* Selected Building Info Card */}
            {selectedBuilding && (
                <Animated.View style={styles.infoCard}>
                    <View style={styles.infoHeader}>
                        <View style={[styles.infoIcon, { backgroundColor: selectedBuilding.color }]}>
                            <Ionicons name={selectedBuilding.icon || 'business'} size={32} color="white" />
                        </View>
                        <View style={styles.infoText}>
                            <Text style={styles.infoTitle}>{selectedBuilding.name}</Text>
                            <Text style={styles.infoDescription}>{selectedBuilding.description}</Text>
                        </View>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedBuilding(null);
                            }}
                        >
                            <Ionicons name="close-circle" size={28} color="#666" />
                        </Pressable>
                    </View>
                    <Pressable
                        style={[styles.enterButton, { backgroundColor: selectedBuilding.color }]}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        }}
                    >
                        <Text style={styles.enterButtonText}>Enter Facility</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </Pressable>
                </Animated.View>
            )}

            {/* Map Controls */}
            <View style={styles.controls}>
                <Pressable
                    style={styles.controlButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        Animated.spring(scale, {
                            toValue: Math.min((scale as any)._value + 0.15, 1.5),
                            useNativeDriver: true,
                        }).start();
                    }}
                >
                    <Ionicons name="add" size={24} color="#1F1F1F" />
                </Pressable>
                <Pressable
                    style={styles.controlButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        Animated.spring(scale, {
                            toValue: Math.max((scale as any)._value - 0.15, 0.3),
                            useNativeDriver: true,
                        }).start();
                    }}
                >
                    <Ionicons name="remove" size={24} color="#1F1F1F" />
                </Pressable>
                <Pressable
                    style={styles.controlButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        Animated.spring(pan, {
                            toValue: { x: SCREEN_WIDTH, y: SCREEN_HEIGHT / 2 },
                            useNativeDriver: true,
                        }).start();
                        Animated.spring(scale, {
                            toValue: 0.55,
                            useNativeDriver: true,
                        }).start();
                    }}
                >
                    <Ionicons name="locate" size={24} color="#1F1F1F" />
                </Pressable>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E1F5FE', // Light blue "sky" background
        overflow: 'hidden',
    },
    mapContainer: {
        width: GRID_SIZE * TILE_WIDTH,
        height: GRID_SIZE * TILE_HEIGHT,
        backgroundColor: '#8BC34A', // Solid green grass base
    },
    tile: {
        position: 'absolute',
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
    },
    building: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buildingLabel: {
        position: 'absolute',
        bottom: -22,
        fontSize: 11,
        fontWeight: '800',
        color: 'white',
        backgroundColor: 'rgba(28, 176, 246, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    selectionRing: {
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#4FC3F7',
        borderStyle: 'dashed',
    },
    player: {
        position: 'absolute',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1CB0F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    playerShadow: {
        position: 'absolute',
        bottom: -5,
        width: 25,
        height: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 15,
    },
    playerEmoji: {
        fontSize: 20,
    },
    infoCard: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 28,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    infoIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    infoText: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#263238',
        marginBottom: 4,
    },
    infoDescription: {
        fontSize: 14,
        fontWeight: '500',
        color: '#607D8B',
    },
    closeButton: {
        padding: 4,
    },
    enterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    enterButtonText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 0.5,
    },
    controls: {
        position: 'absolute',
        bottom: 180,
        right: 24,
        gap: 16,
        zIndex: 10000,
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.05)',
        borderBottomWidth: 4,
    },
    labelTextContainer: {
        position: 'absolute',
        top: -20,
        backgroundColor: 'rgba(38, 50, 56, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    labelText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
});
