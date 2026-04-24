import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import Button from '../ui/Button';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DisconnectModal({ visible, onConfirm, onCancel }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title} accessibilityRole="header">
            Disconnect Wallet?
          </Text>
          <Text style={styles.message}>
            You will be signed out and need to reconnect your wallet to
            continue.
          </Text>
          <View style={styles.actions}>
            <Button
              variant="outline"
              onPress={onCancel}
              style={styles.cancelBtn}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={() => {
                onConfirm();
                onCancel();
              }}
              destructive
              style={styles.disconnectBtn}
            >
              Disconnect
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#F8FAFC', marginBottom: 8 },
  message: { fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: { borderWidth: 1, borderColor: '#475569' },
  cancelText: { color: '#CBD5E1', fontWeight: '600' },
  disconnectBtn: { backgroundColor: '#EF4444' },
  disconnectText: { color: '#FFF', fontWeight: '600' },
});
