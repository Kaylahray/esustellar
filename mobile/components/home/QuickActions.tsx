import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui';
import Button from '../ui/Button';
import { triggerHapticFeedback } from '../../utils/haptics';

interface Action {
  icon: string;
  label: string;
  onPress: () => void;
}

interface Props {
  onContribute?: () => void;
  onJoinGroup?: () => void;
  onMyGroups?: () => void;
}

export function QuickActions({ onContribute, onJoinGroup, onMyGroups }: Props) {
  const handleContribute = () => {
    const contributeAction = onContribute ?? (() => console.log('contribute'));

    // Simulate contribution confirmation with success feedback
    setTimeout(() => {
      triggerHapticFeedback.success();
    }, 1000); // Simulate transaction completion

    contributeAction();
  };

  const actions: Action[] = [
    {
      icon: '💸',
      label: 'Contribute',
      onPress: handleContribute,
    },
    {
      icon: '🤝',
      label: 'Join Group',
      onPress: onJoinGroup ?? (() => console.log('join-group')),
    },
    {
      icon: '👥',
      label: 'My Groups',
      onPress: onMyGroups ?? (() => console.log('my-groups')),
    },
  ];

  return (
    <Card>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.row}>
        {actions.map((action) => (
          <View key={action.label} style={styles.action}>
            <Button
              variant="ghost"
              onPress={action.onPress}
              style={styles.button}
            >
              <Text style={styles.icon}>{action.icon}</Text>
              <Text style={styles.label}>{action.label}</Text>
            </Button>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 13, color: '#94A3B8', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { flex: 1, alignItems: 'center', gap: 6 },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  icon: { fontSize: 28 },
  label: { fontSize: 12, color: '#CBD5E1', textAlign: 'center' },
});
