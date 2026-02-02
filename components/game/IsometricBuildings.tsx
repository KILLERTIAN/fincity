import React from 'react';
import { Image, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

const ASSETS = {
    home: require('../../assets/city/house.png'),
    guild: require('../../assets/city/tower.png'),
    bank: require('../../assets/city/bank.png'),
    store: require('../../assets/city/coffee.png'),
    market: require('../../assets/city/tower2.png'),
    gym: require('../../assets/city/warehouse.png'),
    hospital: require('../../assets/city/hospital.png'),
    police: require('../../assets/city/police.png'),
    bush: require('../../assets/city/bush.png'),
    tree: require('../../assets/city/tree.png'),
    tree2: require('../../assets/city/tree2.png'),
    tower2: require('../../assets/city/tower2.png'),
    tower3: require('../../assets/city/tower3.png'),
};

interface BuildingProps {
    width: number;
    height: number;
    type: 'home' | 'guild' | 'store' | 'market' | 'bank' | 'park' | 'lake' | 'hospital' | 'police' | 'gym' | 'bush' | 'streetlight' | 'trafficLight' | 'tree' | 'tree2' | 'road' | 'tower2' | 'tower3';
    color?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export const IsometricBuilding: React.FC<BuildingProps> = ({ width, height, type, color, direction }) => {
    switch (type) {
        case 'home':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.home} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'guild':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.guild} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'bank':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.bank} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'store':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.store} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'gym':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.gym} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'tower2':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.tower2} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'market':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.market} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'hospital':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.hospital} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'police':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.police} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'tower3':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.tower3} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'bush':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={ASSETS.bush} style={{ width: '60%', height: '60%' }} resizeMode="contain" />
                </View>
            );

        case 'park':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.tree} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'lake':
            return (
                <Svg width={width} height={height} viewBox="0 0 100 100">
                    <Ellipse cx="50" cy="85" rx="48" ry="18" fill="#CFD8DC" />
                    <Ellipse cx="50" cy="82" rx="44" ry="15" fill="#4FC3F7" />
                    <Ellipse cx="40" cy="80" rx="10" ry="3" fill="rgba(255,255,255,0.3)" />
                    <Ellipse cx="65" cy="85" rx="12" ry="4" fill="rgba(255,255,255,0.2)" />
                </Svg>
            );

        case 'streetlight':
            return (
                <Svg width={width} height={height} viewBox="0 0 40 80">
                    <Rect x="18" y="20" width="4" height="60" fill="#455A64" />
                    <Path d="M 20 20 Q 35 20 35 35" stroke="#455A64" strokeWidth="4" fill="none" />
                    <Circle cx="35" cy="35" r="5" fill="#FFEE58" />
                </Svg>
            );

        case 'trafficLight':
            return (
                <Svg width={width} height={height} viewBox="0 0 30 70">
                    <Rect x="12" y="40" width="6" height="30" fill="#455A64" />
                    <Rect x="5" y="5" width="20" height="40" fill="#263238" rx="4" />
                    <Circle cx="15" cy="12" r="4" fill="#EF5350" />
                    <Circle cx="15" cy="25" r="4" fill="#FFEE58" />
                    <Circle cx="15" cy="38" r="4" fill="#66BB6A" />
                </Svg>
            );

        case 'tree':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.tree} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'tree2':
            return (
                <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image source={ASSETS.tree2} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            );

        case 'road':
            return (
                <Svg width={width} height={height} viewBox="0 0 100 100">
                    {/* Road tile - fills viewBox to match container dimensions */}
                    <Path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" fill="#546E7A" />
                </Svg>
            );

        default:
            return null;
    }
};



