import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../ui/Button';
import { triggerHapticFeedback } from '../../utils/haptics';

export function HapticTestDemo() {
  const handleLightHaptic = () => {
    triggerHapticFeedback.light();
  };

  const handleHeavyHaptic = () => {
    triggerHapticFeedback.heavy();
  };

  const handleSuccessHaptic = () => {
    triggerHapticFeedback.success();
  };

  const handleErrorHaptic = () => {
    triggerHapticFeedback.error();
  };

  const handleWarningHaptic = () => {
    triggerHapticFeedback.warning();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Haptic Feedback Test</Text>
      
      <View style={styles.buttonGroup}>
        <Button onPress={handleLightHaptic}>
          Light Impact
        </Button>
        
        <Button onPress={handleHeavyHaptic} destructive>
          Heavy Impact (Destructive)
        </Button>
        
        <Button onPress={handleSuccessHaptic}>
          Success Notification
        </Button>
        
        <Button onPress={handleErrorHaptic}>
          Error Notification
        </Button>
        
        <Button onPress={handleWarningHaptic}>
          Warning Notification
        </Button>
      </View>
      
      <Text style={styles.note}>
        Test on physical device for full haptic feedback experience.
        Simulators will silently fail haptic calls.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F172A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  note: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
