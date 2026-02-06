import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

/**
 * Root index component that handles initial routing logic.
 * Determines whether to show onboarding, login, or the main application.
 */
export default function Index() {
    const [loading, setLoading] = useState(true);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkInitialStatus();
    }, []);

    /**
     * Checks the user's status from AsyncStorage to decide where to navigate.
     */
    const checkInitialStatus = async () => {
        try {
            // FOR TESTING: Uncomment the line below to reset onboarding every time
            // await AsyncStorage.clear(); 

            const completed = await AsyncStorage.getItem('onboardingComplete');
            const token = await AsyncStorage.getItem('authToken');

            console.log('App Status:', { onboardingComplete: completed, hasToken: !!token });

            setOnboardingComplete(completed === 'true');
            setIsLoggedIn(!!token);
        } catch (error) {
            console.error('Error checking initial status:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="#1CB0F6" />
            </View>
        );
    }

    // Direct redirection logic
    if (!onboardingComplete) {
        return <Redirect href="/onboarding" />;
    }

    if (!isLoggedIn) {
        return <Redirect href="/login" />;
    }

    return <Redirect href="/(tabs)" />;
}
