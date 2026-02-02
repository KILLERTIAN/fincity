import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ParticleSystemProps {
  particleCount?: number;
  colors?: string[];
  active?: boolean;
  type?: 'coins' | 'stars' | 'hearts' | 'sparkles';
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 5,
  colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4'],
  active = true,
  type = 'sparkles',
}) => {
  if (!active) return null;

  const getParticleEmoji = () => {
    switch (type) {
      case 'coins':
        return '🪙';
      case 'stars':
        return '⭐';
      case 'hearts':
        return '💖';
      default:
        return '✨';
    }
  };

  // Simple static particles for stability
  const particles = Array.from({ length: Math.min(particleCount, 5) }, (_, index) => (
    <View
      key={index}
      style={[
        styles.particle,
        {
          left: `${20 + index * 15}%`,
          top: `${10 + index * 10}%`,
        },
      ]}
    >
      <Text style={styles.particleText}>{getParticleEmoji()}</Text>
    </View>
  ));

  return (
    <View style={styles.container} pointerEvents="none">
      {particles}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
  },
  particleText: {
    fontSize: 20,
    opacity: 0.7,
  },
});