// utils/haptics.ts
import * as Haptics from 'expo-haptics';

export const HapticFeedback = {
  light: () => {
    // Works on both iOS and Android!
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  selection: () => {
    // This works on both platforms
    Haptics.selectionAsync();
  },

  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
};
