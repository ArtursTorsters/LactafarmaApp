import React from 'react';
import { View, ActivityIndicator, Text} from 'react-native';
import { colors, globalStyles } from '../../styles/styles';
import {LoadingSpinnerProps} from '../../types/index'


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
