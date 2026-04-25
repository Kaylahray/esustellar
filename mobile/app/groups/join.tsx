import React, { useState } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput } from '../../components/ui/TextInput';

const INVITE_CODE_REGEX = /^ESU-[A-Z0-9]{4}-[0-9]{4}$/;

export default function JoinGroupScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleChange = (value: string) => {
    setCode(value);
    if (error) setError(undefined);
  };

  const handleJoin = () => {
    if (!code.trim()) {
      setError('Invite code is required');
      return;
    }
    if (!INVITE_CODE_REGEX.test(code.trim())) {
      setError('Invalid invite code format');
      return;
    }
    // TODO: submit join request
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.screenTitle}>Join Group</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Enter the invite code shared by the group organizer.{'\n'}
          Format: ESU-XXXX-0000
        </Text>

        <TextInput
          label="Invite Code"
          placeholder="ESU-XXXX-0000"
          value={code}
          onChangeText={handleChange}
          autoCapitalize="characters"
          autoCorrect={false}
          error={error}
        />

        <Pressable
          onPress={handleJoin}
          disabled={!code.trim()}
          style={[styles.joinButton, !code.trim() && styles.joinButtonDisabled]}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  backButtonText: { color: '#0F172A', fontWeight: '600' },
  screenTitle: { marginLeft: 16, fontSize: 18, fontWeight: '700', color: '#0F172A' },
  content: { padding: 24 },
  description: { fontSize: 14, color: '#475569', marginBottom: 24, lineHeight: 20 },
  joinButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    alignItems: 'center',
  },
  joinButtonDisabled: { opacity: 0.4 },
  joinButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
