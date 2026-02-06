import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MoodMeterProps {
    mood: number;
    showLabels?: boolean;
}

export const MoodMeter: React.FC<MoodMeterProps> = ({ mood, showLabels = true }) => {
    // Determine color and status based on mood
    const getMoodStatus = () => {
        if (mood >= 80) return { label: 'Hydrated!', color: '#58CC02', icon: 'happy' };
        if (mood >= 50) return { label: 'Chill', color: '#FFD600', icon: 'outlet' };
        return { label: 'Tired', color: '#FF4B4B', icon: 'sad' };
    };

    const status = getMoodStatus();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>PLAYER MOOD</Text>
                <View style={[styles.badge, { backgroundColor: status.color + '20' }]}>
                    <Text style={[styles.valueText, { color: status.color }]}>{mood}%</Text>
                </View>
            </View>

            <View style={styles.meterContainer}>
                <View style={styles.track}>
                    <LinearGradient
                        colors={['#FF4B4B', '#FFD600', '#58CC02']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        locations={[0, 0.5, 1]}
                        style={styles.gradientTrack}
                    />
                    {/* Indicator Knob */}
                    <View style={[styles.indicatorWrapper, { left: `${mood}%` }]}>
                        <View style={[styles.indicatorRing, { borderColor: status.color }]}>
                            <View style={[styles.indicatorInner, { backgroundColor: status.color }]}>
                                <Ionicons name={status.icon as any} size={18} color="white" />
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {showLabels && (
                <View style={styles.labels}>
                    <View style={styles.labelGroup}>
                        <Ionicons name="sad-outline" size={14} color="#FF4B4B" />
                        <Text style={styles.labelText}>Low</Text>
                    </View>
                    <View style={styles.labelGroup}>
                        <Ionicons name="body-outline" size={14} color="#FFD600" />
                        <Text style={styles.labelText}>Avg</Text>
                    </View>
                    <View style={styles.labelGroup}>
                        <Ionicons name="happy-outline" size={14} color="#58CC02" />
                        <Text style={styles.labelText}>Peak</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 14,
        fontWeight: '900',
        color: '#8B8B8B',
        letterSpacing: 2,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
    },
    valueText: {
        fontSize: 14,
        fontWeight: '900',
    },
    meterContainer: {
        height: 44,
        justifyContent: 'center',
        marginBottom: 10,
    },
    track: {
        height: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        position: 'relative',
        marginHorizontal: 10,
    },
    gradientTrack: {
        height: '100%',
        borderRadius: 6,
        opacity: 0.8,
    },
    indicatorWrapper: {
        position: 'absolute',
        top: -16,
        marginLeft: -22, // Half of indicator width
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorRing: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 3,
        padding: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    indicatorInner: {
        flex: 1,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingHorizontal: 10,
    },
    labelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    labelText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#BABABA',
    },
});
