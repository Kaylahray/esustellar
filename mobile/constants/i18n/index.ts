import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type SupportedLanguage = 'en' | 'es';
export const LANGUAGE_STORAGE_KEY = 'esustellar_app_language';

export const languageOptions = [
  { label: 'English', value: 'en' as SupportedLanguage },
  { label: 'Español', value: 'es' as SupportedLanguage },
];

const resources = {
  en: {
    translation: {
      tabs: {
        home: 'Home',
        groups: 'Groups',
        notifications: 'Notifications',
        profile: 'Profile',
      },
      home: {
        goodMorning: 'Good morning',
        goodAfternoon: 'Good afternoon',
        goodEvening: 'Good evening',
        defaultUser: 'EsuStellar User',
        totalBalance: 'Total Balance',
        quickActions: 'Quick Actions',
        balanceValue: '— XLM',
      },
      settings: {
        title: 'Security Settings',
        walletAddress: 'Wallet Address',
        copyWalletAddress: 'Copy wallet address',
        copyToast: 'Wallet address copied to clipboard',
        copyFailed: 'Failed to copy wallet address',
        biometricAuthentication: 'Biometric Authentication',
        supported: 'Supported',
        enableBiometrics: 'Enable biometrics',
        useToSignIn: 'Use {{supportedLabel}} to sign in',
        checkingDeviceCapabilities: 'Checking device capabilities…',
        biometricsNotSupported: 'Biometrics not supported on this device',
        setUpPinFallback: 'Set a PIN below as a fallback when biometrics are unavailable.',
        noBiometricsEnrolled: 'No biometrics enrolled',
        setupBiometricsHelper:
          'Please set up fingerprint or face recognition in your device settings, then return here to enable it.',
        about: 'About',
        version: 'Version',
        build: 'Build',
        pinFallback: 'PIN Fallback',
        pinDescription:
          'Set a 4-6 digit PIN as a fallback when biometrics are unavailable.',
        setUpPin: 'Set up PIN',
        enterPin: 'Enter your PIN',
        confirmYourPin: 'Confirm your PIN',
        pinDigits: '4-6 digits',
        reenterPin: 'Re-enter PIN',
        cancel: 'Cancel',
        next: 'Next',
        confirm: 'Confirm',
        pinSet: 'PIN is set',
        pinFallbackInfo: 'Used as fallback when biometrics fail',
        change: 'Change',
        remove: 'Remove',
        pinMustDigits: 'PIN must be 4-6 digits',
        pinsDoNotMatch: 'PINs do not match',
        biometricsEnabled: 'Biometric authentication enabled',
        biometricsDisabled: 'Biometric authentication disabled',
        biometricFailed: 'Biometric verification failed',
        failedToSavePin: 'Failed to save PIN',
        pinRemoved: 'PIN removed',
        language: 'Language',
        languageLabel: 'Choose your app language',
        languageChangeSuccess: 'Language updated.',
      },
      profile: {
        editProfile: 'Edit Profile',
        settings: 'Settings',
        disconnectWallet: 'Disconnect Wallet',
      },
    },
  },
  es: {
    translation: {
      tabs: {
        home: 'Inicio',
        groups: 'Grupos',
        notifications: 'Notificaciones',
        profile: 'Perfil',
      },
      home: {
        goodMorning: 'Buenos días',
        goodAfternoon: 'Buenas tardes',
        goodEvening: 'Buenas noches',
        defaultUser: 'Usuario de EsuStellar',
        totalBalance: 'Saldo total',
        quickActions: 'Accesos rápidos',
        balanceValue: '— XLM',
      },
      settings: {
        title: 'Ajustes de seguridad',
        walletAddress: 'Dirección de la billetera',
        copyWalletAddress: 'Copiar dirección de la billetera',
        copyToast: 'Dirección copiada al portapapeles',
        copyFailed: 'No se pudo copiar la dirección',
        biometricAuthentication: 'Autenticación biométrica',
        supported: 'Compatible',
        enableBiometrics: 'Activar biometría',
        useToSignIn: 'Usa {{supportedLabel}} para iniciar sesión',
        checkingDeviceCapabilities: 'Comprobando capacidades del dispositivo…',
        biometricsNotSupported: 'La biometría no es compatible con este dispositivo',
        setUpPinFallback:
          'Configura un PIN como respaldo cuando la biometría no esté disponible.',
        noBiometricsEnrolled: 'No hay biometría registrada',
        setupBiometricsHelper:
          'Configura huella o reconocimiento facial en los ajustes del dispositivo y vuelve aquí para activarlo.',
        about: 'Acerca de',
        version: 'Versión',
        build: 'Compilación',
        pinFallback: 'PIN de respaldo',
        pinDescription:
          'Configura un PIN de 4-6 dígitos como respaldo cuando la biometría no esté disponible.',
        setUpPin: 'Configurar PIN',
        enterPin: 'Ingresa tu PIN',
        confirmYourPin: 'Confirma tu PIN',
        pinDigits: '4-6 dígitos',
        reenterPin: 'Vuelve a ingresar el PIN',
        cancel: 'Cancelar',
        next: 'Siguiente',
        confirm: 'Confirmar',
        pinSet: 'El PIN está configurado',
        pinFallbackInfo: 'Se usa como respaldo cuando la biometría falla',
        change: 'Cambiar',
        remove: 'Eliminar',
        pinMustDigits: 'El PIN debe tener 4-6 dígitos',
        pinsDoNotMatch: 'Los PIN no coinciden',
        biometricsEnabled: 'Autenticación biométrica activada',
        biometricsDisabled: 'Autenticación biométrica desactivada',
        biometricFailed: 'La verificación biométrica falló',
        failedToSavePin: 'No se pudo guardar el PIN',
        pinRemoved: 'PIN eliminado',
        language: 'Idioma',
        languageLabel: 'Elige el idioma de la aplicación',
        languageChangeSuccess: 'Idioma actualizado.',
      },
      profile: {
        editProfile: 'Editar perfil',
        settings: 'Ajustes',
        disconnectWallet: 'Desconectar billetera',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const getDeviceLanguage = (): SupportedLanguage => {
  const locale = Localization.locale || 'en';
  const languageTag = locale.split('-')[0] as SupportedLanguage;
  return languageOptions.some((item) => item.value === languageTag) ? languageTag : 'en';
};

export const getLanguage = (): SupportedLanguage => {
  const currentLanguage = i18n.language as SupportedLanguage;
  return languageOptions.some((item) => item.value === currentLanguage) ? currentLanguage : 'en';
};

export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18n.changeLanguage(language);
};

export const loadLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    const language = stored && languageOptions.some((item) => item.value === stored)
      ? (stored as SupportedLanguage)
      : getDeviceLanguage();

    await i18n.changeLanguage(language);
    return language;
  } catch {
    await i18n.changeLanguage('en');
    return 'en';
  }
};

export default i18n;
