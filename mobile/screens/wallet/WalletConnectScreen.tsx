import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button'; // assuming you have a shared Button component

export const WalletConnectScreen: React.FC = () => {
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async (walletType: string) => {
    if (connecting) return; // prevent repeated taps
    setConnecting(true);

    try {
      // simulate connection delay
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          // simulate random failure
          Math.random() > 0.7 ? reject(new Error('Connection failed')) : resolve(true);
        }, 2000)
      );

      Alert.alert('Success', `${walletType} connected successfully`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Wallet</Text>
      <Button
        title="Connect MetaMask"
        onPress={() => connectWallet('MetaMask')}
        loading={connecting}
        disabled={connecting}
      />
      <Button
        title="Connect WalletConnect"
        onPress={() => connectWallet('WalletConnect')}
        loading={connecting}
        disabled={connecting}
      />
      <Button
        title="Connect Coinbase"
        onPress={() => connectWallet('Coinbase')}
        loading={connecting}
        disabled={connecting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
});
