import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, globalStyles } from '../../styles/styles';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "small",
  color = colors.primary,
}) => {
  return (
    <View style={globalStyles.loadingContainer}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={globalStyles.message}>{message}</Text>
      )}
    </View>
  );
};
