import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Switch,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';

import Button from '../../components/ui/Button';

import {
  biometricService,
  BiometricCapability,
  BiometricType,
  SecurityStatus,
} from '../../services/security';

import { pinService } from '../../services/security/pinService';

import {
  getSecurityPreferences,
  saveSecurityPreferences,
  SecurityPreferences,
} from '../../services/security/securityPreferences';

import {
  changeLanguage,
  getLanguage,
  languageOptions,
  loadLanguage,
} from '../../constants/i18n';

const BIOMETRIC_LOCK_KEY = 'biometricLockEnabled';
const WALLET_ADDRESS = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [biometricCap, setBiometricCap] = useState<BiometricCapability>({
    status: SecurityStatus.UNKNOWN,
    supportedTypes: [],
  });

  const [securityPreferences, setSecurityPreferences] =
    useState<SecurityPreferences>({
      biometricEnabled: false,
      pinEnabled: false,
    });

  const [biometricEnabledLocal, setBiometricEnabledLocal] = useState(false);

  const [pinSet, setPinSet] = useState(false);
  const [pinLockoutRemainingMs, setPinLockoutRemainingMs] = useState(0);

  const [language, setLanguage] = useState(getLanguage());
  const [authenticating, setAuthenticating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Load everything ─────────────────────────────────────────

  const loadSecurityState = useCallback(() => {
    let active = true;

    void (async () => {
      const [cap, prefs, pinStatus, storedLang, storedToggle] =
        await Promise.all([
          biometricService.getCapability(),
          getSecurityPreferences(),
          pinService.getStatus(),
          loadLanguage(),
          AsyncStorage.getItem(BIOMETRIC_LOCK_KEY),
        ]);

      if (!active) return;

      setBiometricCap(cap);
      setSecurityPreferences(prefs);
      setPinSet(pinStatus.isPinSet);
      setPinLockoutRemainingMs(pinStatus.remainingLockoutMs);
      setLanguage(storedLang);
      setBiometricEnabledLocal(storedToggle === 'true');
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(loadSecurityState);

  // ── Labels ─────────────────────────────────────────

  const supportedLabel = useMemo(() => {
    if (
      biometricCap.supportedTypes.length === 0 ||
      biometricCap.supportedTypes.includes(BiometricType.NONE)
    ) {
      return 'Unavailable';
    }

    return biometricCap.supportedTypes
      .map((type) => {
        switch (type) {
          case BiometricType.FINGERPRINT:
            return 'Fingerprint';
          case BiometricType.FACIAL_RECOGNITION:
            return 'Face ID';
          case BiometricType.IRIS:
            return 'Iris';
          default:
            return 'Biometrics';
        }
      })
      .join(' / ');
  }, [biometricCap]);

  // ── Biometric (API-based) ─────────────────────────

  const handleBiometricToggle = async () => {
    if (biometricCap.status !== SecurityStatus.AVAILABLE) {
      Alert.alert('Unavailable', 'Set up biometrics first.');
      return;
    }

    setAuthenticating(true);

    const result = await biometricService.authenticate(
      securityPreferences.biometricEnabled
        ? 'Disable biometrics'
        : 'Enable biometrics'
    );

    setAuthenticating(false);

    if (!result.success) {
      setMessage(result.error ?? 'Failed');
      return;
    }

    const next = await saveSecurityPreferences({
      biometricEnabled: !securityPreferences.biometricEnabled,
    });

    setSecurityPreferences(next);
  };

  // ── Simple biometric lock (AsyncStorage) ───────────

  const handleLocalToggle = async (value: boolean) => {
    if (value) {
      const result = await biometricService.authenticate('Enable lock');
      if (!result.success) return;
    }

    setBiometricEnabledLocal(value);
    await AsyncStorage.setItem(BIOMETRIC_LOCK_KEY, value ? 'true' : 'false');
  };

  // ── PIN ───────────────────────────────────────────

  const handleRemovePin = () => {
    Alert.alert('Remove PIN', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await pinService.removePin();
          const next = await saveSecurityPreferences({ pinEnabled: false });

          setSecurityPreferences(next);
          setPinSet(false);
        },
      },
    ]);
  };

  // ── Wallet copy ───────────────────────────────────

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setMessage('Copied');
    } catch {
      setMessage('Failed to copy');
    }
  };

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Settings</Text>

        {/* Wallet */}
        <View>
          <Text>{WALLET_ADDRESS}</Text>
          <Button onPress={handleCopy}>Copy</Button>
        </View>

        {/* Language */}
        <View>
          <Text>Language</Text>
          {languageOptions.map((opt) => (
            <Button
              key={opt.value}
              onPress={async () => {
                await changeLanguage(opt.value);
                setLanguage(opt.value);
              }}
            >
              {opt.label}
            </Button>
          ))}
        </View>

        {/* Biometrics */}
        <View>
          <Text>Biometric Authentication</Text>
          <Text>Supported: {supportedLabel}</Text>

          <Button onPress={handleBiometricToggle} disabled={authenticating}>
            {securityPreferences.biometricEnabled ? 'Disable' : 'Enable'}
          </Button>
        </View>

        {/* Simple Lock Toggle */}
        <View>
          <Text>Biometric Lock</Text>
          <Switch
            value={biometricEnabledLocal}
            onValueChange={handleLocalToggle}
          />
        </View>

        {/* PIN */}
        <View>
          <Text>PIN</Text>

          {pinSet ? (
            <>
              <Button onPress={() => router.push('/security/enter-pin?mode=change')}>
                Change PIN
              </Button>
              <Button onPress={handleRemovePin}>Remove PIN</Button>
            </>
          ) : (
            <Button onPress={() => router.push('/security/setup-pin')}>
              Set PIN
            </Button>
          )}

          {pinLockoutRemainingMs > 0 && (
            <Text>
              Locked for {Math.ceil(pinLockoutRemainingMs / 1000)}s
            </Text>
          )}
        </View>

        {/* About */}
        <View>
          <Text>Version: {Constants.expoConfig?.version}</Text>
        </View>

        {message && <Text>{message}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}