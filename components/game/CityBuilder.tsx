import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { IsometricBuilding } from './IsometricBuildings';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Building {
    id: string;
    type: 'home' | 'guild' | 'store' | 'market' | 'bank' | 'hospital' | 'police' | 'gym' | 'bush' | 'streetlight' | 'trafficLight' | 'tree' | 'tree2' | 'road' | 'tower2' | 'tower3';
    name: string;
    gridX: number;
    gridY: number;
    size: number;
    icon: any;
    isDecoration?: boolean;
}

const GRID_SIZE = 50;
const TILE_WIDTH = 40;
const TILE_HEIGHT = 20;

const gridToIso = (gridX: number, gridY: number) => {
    const x = (gridX - gridY) * (TILE_WIDTH / 2);
    const y = (gridX + gridY) * (TILE_HEIGHT / 2);
    return { x, y };
};

const AVAILABLE_BUILDINGS: any[] = [
    { id: 'bank', type: 'bank', name: 'Classic Bank', size: 3, icon: 'business' },
    { id: 'hospital', type: 'hospital', name: 'City Hospital', size: 3, icon: 'medical' },
    { id: 'tower2', type: 'tower2', name: 'Modern Tower', size: 4, icon: 'business' },
    { id: 'tower3', type: 'tower3', name: 'Elite Plaza', size: 4, icon: 'business' },
    { id: 'home', type: 'home', name: 'Suburban House', size: 2, icon: 'home' },
    { id: 'store', type: 'store', name: 'Coffee House', size: 2, icon: 'cafe' },
    { id: 'gym', type: 'gym', name: 'Warehouse Gym', size: 3, icon: 'barbell' },
    { id: 'market', type: 'market', name: 'Supermarket', size: 3, icon: 'cart' },
    { id: 'police', type: 'police', name: 'Police Station', size: 3, icon: 'shield' },
    { id: 'bush', type: 'bush', name: 'Flower Bush', size: 1, icon: 'leaf', isDecoration: true },
    { id: 'tree', type: 'tree', name: 'Pine Tree', size: 1, icon: 'leaf', isDecoration: true },
    { id: 'tree2', type: 'tree2', name: 'Oak Tree', size: 1, icon: 'leaf', isDecoration: true },
    { id: 'road', type: 'road', name: 'Road Tile', size: 1, icon: 'remove', isDecoration: true },
];

export const CityBuilder: React.FC = () => {
    const [placedBuildings, setPlacedBuildings] = useState<Building[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null);
    const [movingBuilding, setMovingBuilding] = useState<Building | null>(null);
    const [showBuildingMenu, setShowBuildingMenu] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const verticalScrollRef = useRef<ScrollView>(null);
    const horizontalScrollRef = useRef<ScrollView>(null);
    const gridOffset = GRID_SIZE * TILE_WIDTH / 2;

    useEffect(() => {
        loadCity();
        setTimeout(() => {
            const midX = (GRID_SIZE * TILE_WIDTH) / 2;
            const midY = (GRID_SIZE * TILE_HEIGHT) / 2;
            verticalScrollRef.current?.scrollTo({ y: midY, animated: false });
            horizontalScrollRef.current?.scrollTo({ x: midX, animated: false });
        }, 300);
    }, []);

    const createDefaultCity = () => {
        const buildings: Building[] = [];
        let idCounter = 0;

        const addB = (type: string, gx: number, gy: number) => {
            const template = AVAILABLE_BUILDINGS.find(b => b.type === type);
            if (template) {
                buildings.push({
                    ...template,
                    id: `${type}-${idCounter++}`,
                    gridX: gx,
                    gridY: gy,
                });
            }
        };

        // 1. Precise Urban Grid (Narrower blocks for density)
        const roads = [12, 17, 22, 27, 32, 37];
        roads.forEach(pos => {
            for (let i = 8; i <= 40; i++) {
                addB('road', pos, i); // Vertical
                addB('road', i, pos); // Horizontal
            }
        });

        // 2. High-Rise Downtown Core (Clustered towers)
        addB('tower3', 23, 23);
        addB('tower2', 18, 23);
        addB('tower3', 23, 18);
        addB('tower2', 28, 23);
        addB('tower3', 23, 28);

        // 3. Civic & Commercial Clusters (Next to roads)
        addB('bank', 13, 13);
        addB('hospital', 33, 13);
        addB('police', 13, 33);
        addB('market', 33, 33);
        addB('gym', 28, 18);
        addB('store', 18, 28);

        // 4. Neighborhood Infill (Houses and small shops)
        addB('home', 9, 9);
        addB('home', 9, 14);
        addB('home', 38, 9);
        addB('home', 38, 14);
        addB('store', 14, 9);
        addB('home', 9, 38);
        addB('home', 14, 38);
        addB('home', 38, 38);
        addB('market', 9, 28);

        // 5. Aesthetic Streetscape (Bushes lining EVERY road)
        roads.forEach(r => {
            for (let i = 8; i <= 40; i += 2) {
                // Sidewalk bushes
                addB('bush', r + 1, i);
                addB('bush', i, r + 1);
            }
        });

        // 6. Forest Boundary (Dense framing)
        for (let i = 5; i <= 45; i += 2) {
            addB('tree', 6, i);
            addB('tree2', 43, i);
            addB('tree', i, 6);
            addB('tree2', i, 43);
        }

        setPlacedBuildings(buildings);
        AsyncStorage.setItem('fincity_layout', JSON.stringify(buildings));
    };

    const loadCity = async () => {
        try {
            const saved = await AsyncStorage.getItem('fincity_layout');
            if (saved) {
                const buildings = JSON.parse(saved);
                // Increased threshold to 80 for this new high-density logic
                if (buildings.length > 80) {
                    setPlacedBuildings(buildings);
                } else {
                    createDefaultCity();
                }
            } else {
                createDefaultCity();
            }
        } catch (e) {
            createDefaultCity();
        }
    };

    const saveLayout = async () => {
        await AsyncStorage.setItem('fincity_layout', JSON.stringify(placedBuildings));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setEditMode(false);
    };

    const handleTilePress = (gx: number, gy: number) => {
        if (editMode) {
            if (movingBuilding) {
                // Rule: No overlapping roads
                const overlapsRoad = placedBuildings.some(b => {
                    if (b.type !== 'road') return false;
                    return (gx <= b.gridX && gx + movingBuilding.size > b.gridX &&
                        gy <= b.gridY && gy + movingBuilding.size > b.gridY);
                });

                const occupied = placedBuildings.some(b => {
                    return !(gx + movingBuilding.size <= b.gridX || gx >= b.gridX + b.size || gy + movingBuilding.size <= b.gridY || gy >= b.gridY + b.size);
                });

                if (occupied || overlapsRoad || gx + movingBuilding.size > GRID_SIZE || gy + movingBuilding.size > GRID_SIZE) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    return;
                }

                const placedB = { ...movingBuilding, gridX: gx, gridY: gy };
                setPlacedBuildings([...placedBuildings, placedB]);
                setMovingBuilding(null);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                return;
            }

            const index = placedBuildings.findIndex(b => gx >= b.gridX && gx < b.gridX + b.size && gy >= b.gridY && gy < b.gridY + b.size);
            if (index !== -1) {
                const picked = placedBuildings[index];
                const newArr = [...placedBuildings];
                newArr.splice(index, 1);
                setPlacedBuildings(newArr);
                setMovingBuilding(picked);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
            return;
        }

        if (selectedBuilding) {
            const overlapsRoad = placedBuildings.some(b => {
                if (b.type !== 'road') return false;
                return (gx <= b.gridX && gx + selectedBuilding.size > b.gridX &&
                    gy <= b.gridY && gy + selectedBuilding.size > b.gridY);
            });

            const occupied = placedBuildings.some(b => {
                return !(gx + selectedBuilding.size <= b.gridX || gx >= b.gridX + b.size || gy + selectedBuilding.size <= b.gridY || gy >= b.gridY + b.size);
            });

            if (occupied || overlapsRoad || gx + selectedBuilding.size > GRID_SIZE || gy + selectedBuilding.size > GRID_SIZE) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                return;
            }

            const nb: Building = { ...selectedBuilding, id: `${selectedBuilding.type}-${Date.now()}`, gridX: gx, gridY: gy };
            setPlacedBuildings([...placedBuildings, nb]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSelectedBuilding(null);
        }
    };

    const renderTile = (x: number, y: number) => {
        const { x: sx, y: sy } = gridToIso(x, y);
        const building = placedBuildings.find(b => x >= b.gridX && x < b.gridX + b.size && y >= b.gridY && y < b.gridY + b.size);
        const isRoad = building?.type === 'road';

        let color = '#9CCC65';
        if (isRoad) color = '#455A64';

        return (
            <Pressable key={`${x}-${y}`} style={{ position: 'absolute', left: sx, top: sy, width: TILE_WIDTH, height: TILE_HEIGHT }} onPress={() => handleTilePress(x, y)}>
                <Svg width={TILE_WIDTH} height={TILE_HEIGHT}>
                    <Polygon points={`${TILE_WIDTH / 2},0 ${TILE_WIDTH},${TILE_HEIGHT / 2} ${TILE_WIDTH / 2},${TILE_HEIGHT} 0,${TILE_HEIGHT / 2}`} fill={color} stroke="rgba(255,255,255,0.1) " strokeWidth="0.5" />
                </Svg>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name="construct" size={24} color="#1CB0F6" />
                    <Text style={styles.title}>City Builder</Text>
                </View>
                <Text style={styles.subtitle}>
                    {movingBuilding ? `Moving ${movingBuilding.name}` : selectedBuilding ? `Placing ${selectedBuilding.name}` : editMode ? 'Tap building to move, tap ground to place' : 'Build your financial empire'}
                </Text>
            </View>

            <ScrollView ref={verticalScrollRef} style={styles.flex1} showsVerticalScrollIndicator={false}>
                <ScrollView ref={horizontalScrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 100 }}>
                    <View style={{ width: GRID_SIZE * TILE_WIDTH, height: GRID_SIZE * TILE_HEIGHT }}>
                        <View style={{ position: 'absolute', left: gridOffset, top: 50 }}>
                            {Array.from({ length: GRID_SIZE }).map((_, y) =>
                                Array.from({ length: GRID_SIZE }).map((_, x) => renderTile(x, y))
                            )}
                        </View>

                        {placedBuildings.filter(b => b.type !== 'road').map(b => {
                            const { x, y } = gridToIso(b.gridX, b.gridY);
                            const centerX = gridOffset + x;
                            const bottomY = 50 + y + (b.size * TILE_HEIGHT);
                            const width = b.size * TILE_WIDTH;
                            const height = width * 1.5;
                            const left = centerX - width / 2;
                            const top = bottomY - height;
                            const depth = (b.gridX + b.size) + (b.gridY + b.size);

                            return (
                                <View key={b.id} style={[styles.building, { left, top, width, height, zIndex: 1000 + depth }]}>
                                    <Pressable style={styles.flex1} onPress={() => editMode && handleTilePress(b.gridX, b.gridY)}>
                                        <IsometricBuilding type={b.type} width={width} height={height} />
                                        {editMode && <View style={styles.delete}><Ionicons name="close-circle" size={24} color="#FF5252" /></View>}
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable style={[styles.btn, { backgroundColor: '#F44336' }]} onPress={() => Alert.alert('Reset City', 'Start over with the default city layout?', [{ text: 'Cancel' }, { text: 'Reset', onPress: createDefaultCity }])}>
                    <Ionicons name="refresh" size={18} color="white" /><Text style={styles.btnText}>Reset</Text>
                </Pressable>
                <Pressable style={[styles.btn, editMode && { backgroundColor: '#FF9800' }]} onPress={() => setEditMode(!editMode)}>
                    <Ionicons name={editMode ? "checkmark" : "create"} size={18} color="white" /><Text style={styles.btnText}>{editMode ? 'Done' : 'Edit'}</Text>
                </Pressable>
                <Pressable style={styles.btn} onPress={() => setShowBuildingMenu(true)}>
                    <Ionicons name="add" size={18} color="white" /><Text style={styles.btnText}>Add</Text>
                </Pressable>
                <Pressable style={[styles.btn, { backgroundColor: '#4CAF50' }]} onPress={saveLayout}>
                    <Ionicons name="save" size={18} color="white" /><Text style={styles.btnText}>Save</Text>
                </Pressable>
            </View>

            <Modal visible={showBuildingMenu} animationType="slide" transparent>
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.mTitle}>Select Asset</Text>
                            <Pressable onPress={() => setShowBuildingMenu(false)}><Ionicons name="close" size={28} /></Pressable>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {AVAILABLE_BUILDINGS.map(b => (
                                <Pressable key={b.id} style={styles.option} onPress={() => { setSelectedBuilding(b); setShowBuildingMenu(false); setEditMode(false); }}>
                                    <View style={styles.preview}><IsometricBuilding type={b.type} width={50} height={50} /></View>
                                    <View style={styles.info}><Text style={styles.name}>{b.name}</Text><Text style={styles.size}>{b.size}x{b.size} Tiles</Text></View>
                                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E1F5FE' },
    header: { paddingTop: 60, paddingBottom: 20, backgroundColor: 'white', alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, elevation: 10, zIndex: 100 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    title: { fontSize: 22, fontWeight: '900', color: '#333' },
    subtitle: { fontSize: 13, color: '#666', marginTop: 4 },
    flex1: { flex: 1 },
    building: { position: 'absolute' },
    delete: { position: 'absolute', top: -5, right: -5, backgroundColor: 'white', borderRadius: 12 },
    footer: { position: 'absolute', bottom: 110, left: 10, right: 10, flexDirection: 'row', justifyContent: 'center', gap: 8, zIndex: 200, backgroundColor: 'rgba(255,255,255,0.85)', padding: 12, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    btn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1CB0F6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, shadowOpacity: 0.2, elevation: 5 },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
    modal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '70%', paddingBottom: 30 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderColor: '#EEE' },
    mTitle: { fontSize: 20, fontWeight: 'bold' },
    option: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#F9F9F9', borderRadius: 15, padding: 12 },
    preview: { width: 50, height: 50, marginRight: 15, alignItems: 'center', justifyContent: 'center' },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    size: { fontSize: 12, color: '#999' },
});
