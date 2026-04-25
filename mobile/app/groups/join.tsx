'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TextInput } from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { groupsApi } from '../../services/api/groupsApi';

const INVITE_CODE_REGEX = /^ESU-[A-Z0-9]{4}-[0-9]{4}$/;

interface GroupInfo {
  groupId: string;
  groupName: string;
  memberCount: number;
  maxMembers: number;
  contributionAmount: number;
  payoutFrequency: string;
  description?: string;
  creatorAddress: string;
}

export default function JoinGroupScreen() {
  const router = useRouter();
  const [joinMethod, setJoinMethod] = useState<'invite' | 'qr'>('invite');
  const [inviteCode, setInviteCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [error, setError] = useState('');

  const handleInviteCodeChange = (value: string) => {
    setInviteCode(value.toUpperCase());
    setError('');
    if (groupInfo) setGroupInfo(null);
  };

  const validateInviteCode = async () => {
    const code = inviteCode.trim();

    if (!code) {
      setError('Invite code is required');
      return;
    }

    // ✅ Regex validation from your other branch
    if (!INVITE_CODE_REGEX.test(code)) {
      setError('Invalid format. Use ESU-XXXX-0000');
      return;
    }

    setValidating(true);
    setError('');

    try {
      const response = await groupsApi.validateInviteCode(code);

      if (response.success && response.data) {
        setGroupInfo({
          groupId: response.data.groupId,
          groupName: response.data.groupName,
          memberCount: response.data.memberCount,
          maxMembers: response.data.maxMembers,
          contributionAmount: 100,
          payoutFrequency: 'monthly',
          description: 'A great savings group',
          creatorAddress: '0x1234...5678',
        });
      } else {
        setError(response.error || 'Invalid invite code');
      }
    } catch {
      setError('Failed to validate invite code');
    } finally {
      setValidating(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupInfo) {
      setError('Please validate the invite code first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userAddress = '0xuser...address';

      const response = await groupsApi.joinGroupWithCode(inviteCode, userAddress);

      if (response.success) {
        Alert.alert(
          'Success!',
          `You joined "${groupInfo.groupName}"`,
          [
            { text: 'View Group', onPress: () => router.push(`/groups/${groupInfo.groupId}`) },
            { text: 'Go to Groups', onPress: () => router.push('/groups') }
          ]
        );
      } else {
        setError(response.error || 'Failed to join group');
      }
    } catch {
      setError('Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  const handleQRCodeScan = () => {
    Alert.alert(
      'QR Code Scanner',
      'Mock scanner for now',
      [
        {
          text: 'Mock Scan',
          onPress: () => {
            const mock = 'ESU-ABCD-1234';
            setQrCodeData(mock);
            setInviteCode(mock);
            setJoinMethod('invite');
            setTimeout(validateInviteCode, 300);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Group</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Method Selector */}
        <View style={styles.methodSelector}>
          <TouchableOpacity onPress={() => setJoinMethod('invite')}>
            <Text>Invite Code</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setJoinMethod('qr')}>
            <Text>QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Invite Form */}
        {joinMethod === 'invite' && (
          <View style={styles.form}>
            <TextInput
              label="Invite Code"
              value={inviteCode}
              onChangeText={handleInviteCodeChange}
              placeholder="ESU-XXXX-0000"
              autoCapitalize="characters"
              error={error}
            />

            <Button onPress={validateInviteCode} loading={validating}>
              Validate
            </Button>
          </View>
        )}

        {/* QR */}
        {joinMethod === 'qr' && (
          <TouchableOpacity onPress={handleQRCodeScan}>
            <Text>Tap to Scan QR</Text>
          </TouchableOpacity>
        )}

        {/* Preview */}
        {groupInfo && (
          <Card>
            <Text>{groupInfo.groupName}</Text>
            <Text>{groupInfo.memberCount}/{groupInfo.maxMembers}</Text>

            <Button onPress={handleJoinGroup} loading={loading}>
              Join Group
            </Button>
          </Card>
        )}
      </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  methodSelector: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginVertical: 24,
  },
  methodOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  selectedMethod: {
    backgroundColor: '#6366F1',
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedMethodText: {
    color: '#fff',
  },
  formContainer: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  inviteInput: {
    paddingRight: 100,
  },
  validateButton: {
    position: 'absolute',
    right: 8,
    top: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#6366F1',
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#334155',
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    flex: 1,
  },
  qrScanner: {
    aspectRatio: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  qrPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  qrPlaceholderText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  qrResult: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
  },
  qrResultLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  qrResultText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'monospace',
  },
  groupPreview: {
    marginBottom: 24,
    padding: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  previewItem: {
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  previewValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  previewDescription: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
  spotsAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#10B98120',
    borderRadius: 8,
  },
  spotsText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  actionContainer: {
    marginBottom: 24,
  },
  joinButton: {
    paddingVertical: 16,
  },
  helpSection: {
    marginBottom: 32,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  helpText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
});
