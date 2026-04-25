import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAutoLock } from '../hooks/useAutoLock';

const ONBOARDING_KEY = 'onboardingComplete';

export default function RootLayout() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useAutoLock(() => {
    router.replace('/wallet/connect');
  });

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      if (value === 'true') {
        router.replace('/wallet/connect');
      } else {
        router.replace('/onboarding');
      }
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
