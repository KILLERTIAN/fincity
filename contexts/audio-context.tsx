import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AudioSettings {
    musicEnabled: boolean;
    soundEnabled: boolean;
    musicVolume: number;
    soundVolume: number;
}

interface AudioContextType {
    settings: AudioSettings;
    toggleMusic: () => void;
    toggleSound: () => void;
    setMusicVolume: (volume: number) => void;
    setSoundVolume: (volume: number) => void;
    playSound: (soundType: SoundType) => void;
    playHapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
}

type SoundType =
    | 'button_click'
    | 'success'
    | 'error'
    | 'coin'
    | 'level_up'
    | 'achievement'
    | 'notification'
    | 'transaction';

const DEFAULT_SETTINGS: AudioSettings = {
    musicEnabled: true,
    soundEnabled: true,
    musicVolume: 0.3,
    soundVolume: 0.7,
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

interface AudioProviderProps {
    children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<AudioSettings>(DEFAULT_SETTINGS);

    // Load settings from storage
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('audioSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Failed to load audio settings:', error);
        }
    };

    const saveSettings = async (newSettings: AudioSettings) => {
        try {
            await AsyncStorage.setItem('audioSettings', JSON.stringify(newSettings));
        } catch (error) {
            console.error('Failed to save audio settings:', error);
        }
    };

    // Play haptic feedback as audio substitute
    const playHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
        if (!settings.soundEnabled) return;

        switch (type) {
            case 'light':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
            case 'medium':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'heavy':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            case 'success':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'error':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                break;
        }
    }, [settings.soundEnabled]);

    // Play sound with haptic fallback
    const playSound = useCallback((soundType: SoundType) => {
        if (!settings.soundEnabled) return;

        // Map sounds to haptic feedback types
        const hapticMap: Record<SoundType, 'light' | 'medium' | 'heavy' | 'success' | 'error'> = {
            button_click: 'light',
            success: 'success',
            error: 'error',
            coin: 'medium',
            level_up: 'success',
            achievement: 'success',
            notification: 'medium',
            transaction: 'medium',
        };

        playHapticFeedback(hapticMap[soundType]);
    }, [settings.soundEnabled, playHapticFeedback]);

    const toggleMusic = useCallback(() => {
        const newSettings = { ...settings, musicEnabled: !settings.musicEnabled };
        setSettings(newSettings);
        saveSettings(newSettings);
    }, [settings]);

    const toggleSound = useCallback(() => {
        const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
        setSettings(newSettings);
        saveSettings(newSettings);
    }, [settings]);

    const setMusicVolume = useCallback((volume: number) => {
        const newSettings = { ...settings, musicVolume: volume };
        setSettings(newSettings);
        saveSettings(newSettings);
    }, [settings]);

    const setSoundVolume = useCallback((volume: number) => {
        const newSettings = { ...settings, soundVolume: volume };
        setSettings(newSettings);
        saveSettings(newSettings);
    }, [settings]);

    const value: AudioContextType = {
        settings,
        toggleMusic,
        toggleSound,
        setMusicVolume,
        setSoundVolume,
        playSound,
        playHapticFeedback,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};
