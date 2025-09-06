import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../styles/styles';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryText = "Try Again",
}) => {
  return (
    <View style={globalStyles.errorContainer}>
      <Ionicons name="alert-circle" size={48} color={colors.error} />
      <Text style={globalStyles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity
          style={globalStyles.retryButton}
          onPress={onRetry}
          accessibilityLabel={retryText}
          accessibilityRole="button"
        >
          <Ionicons name="refresh" size={20} color={colors.white} />
          <Text style={globalStyles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
