import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Slot, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NotificationBanner } from '../components/notifications/NotificationBanner';
import { loadLanguage } from '../constants/i18n';
import { useAutoLock } from '../hooks/useAutoLock';
import { biometricService } from '../services/security';
import { getRouteFromNotificationData } from '../services/notifications/notificationRouting';

const ONBOARDING_KEY = 'onboardingComplete';
const BIOMETRIC_LOCK_KEY = 'biometricLockEnabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
  }),
});

export default function RootLayout() {
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [checking, setChecking] = useState(true);
  const [banner, setBanner] = useState<{
    body?: string;
    data?: Record<string, unknown>;
    title: string;
  } | null>(null);
  const [masked, setMasked] = useState(false);
  const [locked, setLocked] = useState(false);
  const router = useRouter();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // ── Biometric unlock ────────────────────────────────────────────────────

  const promptBiometric = async () => {
    const enabled = await AsyncStorage.getItem(BIOMETRIC_LOCK_KEY);
    if (enabled !== 'true') return;

    const result = await biometricService.authenticate('Unlock EsuStellar');
    if (result.success) {
      setLocked(false);
    }
    // If failed/cancelled, stay locked — user can retry by foregrounding again
  };

  // ── AppState listener ───────────────────────────────────────────────────

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextState: AppStateStatus) => {
        const prev = appState.current;
        appState.current = nextState;

        // Show overlay when going to background/inactive (#168)
        if (nextState === 'background' || nextState === 'inactive') {
          setMasked(true);
        }

        // On foreground resume: remove overlay and trigger biometric lock (#165)
        if (nextState === 'active' && (prev === 'background' || prev === 'inactive')) {
          setMasked(false);
          const enabled = await AsyncStorage.getItem(BIOMETRIC_LOCK_KEY);
          if (enabled === 'true') {
            setLocked(true);
            await promptBiometric();
          }
        }
      }
    );

    return () => subscription.remove();
  }, []);

  // ── Initial routing ─────────────────────────────────────────────────────

  useAutoLock(() => {
    router.replace('/wallet/connect');
  });

  useEffect(() => {
    async function initialize() {
      const startTime = Date.now();
      await loadLanguage();

      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (value === 'true') {
        router.replace('/wallet/connect');
      } else {
        router.replace('/onboarding');
      }

      setChecking(false);

      const endTime = Date.now();
      const startupTime = endTime - startTime;
      console.log(`App startup time: ${startupTime}ms`);
    }

    initialize();
  }, [router]);

  // ── Notifications ───────────────────────────────────────────────────────

  const dismissBanner = useCallback(() => {
    if (bannerTimerRef.current) {
      clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = null;
    }
    setBanner(null);
  }, []);

  const navigateFromNotification = useCallback(
    (data?: Record<string, unknown>) => {
      dismissBanner();
      const route = getRouteFromNotificationData(data);
      if (route) {
        router.push(route as any);
      }
    },
    [dismissBanner, router]
  );

  const showBanner = useCallback((notification: Notifications.Notification) => {
    const content = notification.request.content;

    setBanner({
      body: content.body ?? undefined,
      data: (content.data ?? {}) as Record<string, unknown>,
      title: content.title ?? 'New notification',
    });

    if (bannerTimerRef.current) {
      clearTimeout(bannerTimerRef.current);
    }

    bannerTimerRef.current = setTimeout(() => {
      setBanner(null);
      bannerTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        showBanner(notification);
      }
    );
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigateFromNotification(
          response.notification.request.content.data as Record<string, unknown>
        );
      });

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      navigateFromNotification(
        response.notification.request.content.data as Record<string, unknown>
      );
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
      if (bannerTimerRef.current) {
        clearTimeout(bannerTimerRef.current);
      }
    };
  }, [navigateFromNotification, showBanner]);

  if (checking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.root}>
        <Slot />

        <NotificationBanner
          body={banner?.body}
          title={banner?.title ?? ''}
          visible={Boolean(banner)}
          onDismiss={dismissBanner}
          onPress={() => navigateFromNotification(banner?.data)}
        />

        {/* App-switcher mask overlay (#168) */}
        {masked && (
          <View style={styles.overlay} pointerEvents="none">
            <Text style={styles.overlayText}>EsuStellar</Text>
          </View>
        )}

        {/* Biometric lock screen (#165) */}
        {locked && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>EsuStellar</Text>
            <Text style={styles.lockHint} onPress={promptBiometric}>
              Tap to unlock
            </Text>
          </View>
        )}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  overlayText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  lockHint: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginTop: 16,
  },
});
