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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Building types with their properties
export interface Building {
    id: string;
    name: string;
    type: 'home' | 'guild' | 'store' | 'market' | 'bank' | 'park' | 'parking' | 'lake' | 'restaurant' | 'gym';
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    gridX: number;
    gridY: number;
    width?: number;
    height?: number;
    description?: string;
}

const TILE_WIDTH = 80;
const TILE_HEIGHT = 40;

// Convert grid coordinates to isometric screen coordinates
const gridToIso = (gridX: number, gridY: number) => {
    const isoX = (gridX - gridY) * (TILE_WIDTH / 2);
    const isoY = (gridX + gridY) * (TILE_HEIGHT / 2);
    return { x: isoX, y: isoY };
};

// Default buildings layout
const DEFAULT_BUILDINGS: Building[] = [
    { id: '1', name: 'Your Home', type: 'home', icon: 'home', color: '#FF9500', gridX: 2, gridY: 2, width: 2, height: 2, description: 'Your cozy home sweet home' },
    { id: '2', name: 'Guild Hall', type: 'guild', icon: 'shield', color: '#9370DB', gridX: 5, gridY: 1, width: 2, height: 2, description: 'Join forces with other players' },
    { id: '3', name: 'General Store', type: 'store', icon: 'storefront', color: '#58CC02', gridX: 1, gridY: 5, width: 1.5, height: 1.5, description: 'Buy essential items' },
    { id: '4', name: 'Market Plaza', type: 'market', icon: 'cart', color: '#FFB800', gridX: 4, gridY: 4, width: 2, height: 2, description: 'Trade with other players' },
    { id: '5', name: 'City Bank', type: 'bank', icon: 'business', color: '#1CB0F6', gridX: 7, gridY: 3, width: 2, height: 2, description: 'Manage your finances' },
    { id: '6', name: 'Central Park', type: 'park', icon: 'leaf', color: '#4CAF50', gridX: 3, gridY: 6, width: 2, height: 2, description: 'Relax and enjoy nature' },
    { id: '7', name: 'Parking Lot', type: 'parking', icon: 'car', color: '#9E9E9E', gridX: 8, gridY: 6, width: 1.5, height: 1, description: 'Park your vehicles' },
    { id: '8', name: 'Crystal Lake', type: 'lake', icon: 'water', color: '#00BCD4', gridX: 1, gridY: 8, width: 2.5, height: 2, description: 'A peaceful lake' },
    { id: '9', name: 'Restaurant', type: 'restaurant', icon: 'restaurant', color: '#FF6B35', gridX: 6, gridY: 7, width: 1.5, height: 1.5, description: 'Delicious meals await' },
    { id: '10', name: 'Fitness Gym', type: 'gym', icon: 'fitness', color: '#E91E63', gridX: 9, gridY: 1, width: 1.5, height: 1.5, description: 'Train and get stronger' },
];

interface CityMapProps {
    buildings?: Building[];
    onBuildingSelect?: (building: Building) => void;
    playerPosition?: { gridX: number; gridY: number };
}

export const CityMap: React.FC<CityMapProps> = ({
    buildings = DEFAULT_BUILDINGS,
    onBuildingSelect,
    playerPosition = { gridX: 2, gridY: 2 },
}) => {
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [pan] = useState(new Animated.ValueXY({ x: SCREEN_WIDTH / 2 - 200, y: 100 }));
    const [scale] = useState(new Animated.Value(1));

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
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: () => {
            pan.flattenOffset();
        },
    });

    const handleBuildingPress = (building: Building) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedBuilding(building);
        onBuildingSelect?.(building);
    };

    const renderIsometricTile = (gridX: number, gridY: number, key: string) => {
        const { x, y } = gridToIso(gridX, gridY);

        // Determine tile color based on position (create a pattern)
        const isLight = (gridX + gridY) % 2 === 0;
        const tileColor = isLight ? '#A8E6A1' : '#8FD987';

        return (
            <View
                key={key}
                style={[
                    styles.tile,
                    {
                        left: x,
                        top: y,
                        borderBottomColor: isLight ? '#7BC973' : '#6BB863',
                    },
                ]}
            >
                <View style={[styles.tileTop, { backgroundColor: tileColor }]} />
            </View>
        );
    };

    const renderBuilding = (building: Building) => {
        const { x, y } = gridToIso(building.gridX, building.gridY);
        const buildingWidth = (building.width || 1) * 60;
        const buildingHeight = (building.height || 1) * 80;
        const isSelected = selectedBuilding?.id === building.id;

        return (
            <Pressable
                key={building.id}
                style={[
                    styles.building,
                    {
                        left: x - buildingWidth / 2 + TILE_WIDTH / 2,
                        top: y - buildingHeight + TILE_HEIGHT / 2,
                        width: buildingWidth,
                        height: buildingHeight,
                    },
                ]}
                onPress={() => handleBuildingPress(building)}
            >
                <Animated.View
                    style={[
                        styles.buildingContent,
                        {
                            backgroundColor: building.color,
                            borderColor: building.color,
                            transform: [{ scale: isSelected ? 1.1 : 1 }],
                        },
                    ]}
                >
                    <View style={[styles.buildingRoof, { backgroundColor: building.color }]} />
                    <View style={styles.buildingBody}>
                        <Ionicons name={building.icon} size={buildingWidth * 0.4} color="white" />
                    </View>
                    {isSelected && (
                        <View style={styles.selectionRing} />
                    )}
                </Animated.View>
                <Text style={styles.buildingLabel} numberOfLines={1}>
                    {building.name}
                </Text>
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
                    },
                ]}
            >
                <View style={styles.playerShadow} />
                <View style={styles.playerBody}>
                    <Text style={styles.playerEmoji}>🧑</Text>
                </View>
            </View>
        );
    };

    // Generate grid tiles
    const tiles = [];
    for (let gridY = 0; gridY < 12; gridY++) {
        for (let gridX = 0; gridX < 12; gridX++) {
            tiles.push(renderIsometricTile(gridX, gridY, `tile-${gridX}-${gridY}`));
        }
    }

    return (
        <View style={styles.container}>
            {/* Map Container */}
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
                {/* Render tiles */}
                {tiles}

                {/* Render buildings */}
                {buildings.map(renderBuilding)}

                {/* Render player */}
                {renderPlayer()}
            </Animated.View>

            {/* Building Info Card */}
            {selectedBuilding && (
                <Animated.View style={styles.infoCard}>
                    <View style={styles.infoHeader}>
                        <View style={[styles.infoIcon, { backgroundColor: selectedBuilding.color }]}>
                            <Ionicons name={selectedBuilding.icon} size={32} color="white" />
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
                            // Handle enter building
                        }}
                    >
                        <Text style={styles.enterButtonText}>Enter Building</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </Pressable>
                </Animated.View>
            )}

            {/* Controls */}
            <View style={styles.controls}>
                <Pressable
                    style={styles.controlButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        Animated.spring(scale, {
                            toValue: Math.min((scale as any)._value + 0.2, 1.5),
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
                            toValue: Math.max((scale as any)._value - 0.2, 0.5),
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
                            toValue: { x: SCREEN_WIDTH / 2 - 200, y: 100 },
                            useNativeDriver: true,
                        }).start();
                        Animated.spring(scale, {
                            toValue: 1,
                            useNativeDriver: true,
                        }).start();
                    }}
                >
                    <Ionicons name="locate" size={24} color="#1F1F1F" />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        overflow: 'hidden',
    },
    mapContainer: {
        position: 'absolute',
        width: SCREEN_WIDTH * 3,
        height: SCREEN_HEIGHT * 3,
        left: -SCREEN_WIDTH,
        top: -SCREEN_HEIGHT,
    },
    tile: {
        position: 'absolute',
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
    },
    tileTop: {
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        transform: [{ rotateX: '60deg' }, { rotateZ: '45deg' }],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    building: {
        position: 'absolute',
        alignItems: 'center',
    },
    buildingContent: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        borderWidth: 3,
        borderBottomWidth: 6,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buildingRoof: {
        height: '30%',
        width: '100%',
        opacity: 0.8,
    },
    buildingBody: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buildingLabel: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: '900',
        color: '#1F1F1F',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    selectionRing: {
        position: 'absolute',
        top: -6,
        left: -6,
        right: -6,
        bottom: -6,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#FFD700',
        borderStyle: 'dashed',
    },
    player: {
        position: 'absolute',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerShadow: {
        position: 'absolute',
        bottom: -5,
        width: 30,
        height: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 15,
    },
    playerBody: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFD700',
        borderWidth: 3,
        borderColor: '#FFA500',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    playerEmoji: {
        fontSize: 24,
    },
    infoCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 3,
        borderColor: '#E0E0E0',
        borderBottomWidth: 6,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 3,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    infoText: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    infoDescription: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    closeButton: {
        padding: 4,
    },
    enterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 4,
    },
    enterButtonText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    controls: {
        position: 'absolute',
        top: 60,
        right: 20,
        gap: 12,
    },
    controlButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 3,
        borderColor: '#E0E0E0',
        borderBottomWidth: 5,
    },
});
