import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../styles/styles';

interface MedicalDisclaimerProps {
  style?: any;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ style }) => {
  const openELactancia = () => {
    Linking.openURL('https://www.e-lactancia.org');
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Ionicons name="warning" size={24} color={colors.warning} />
        <Text style={styles.title}>Important Medical Disclaimer</Text>
      </View>

      <Text style={styles.text}>
        This information does not substitute the advice of a healthcare professional.
        Always consult your doctor before making medication decisions during breastfeeding.
      </Text>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning + '20',
    padding: spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.gray800,
    marginLeft: spacing.sm,
    flex: 1,
  },
  text: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray700,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
    marginBottom: spacing.md,
  },
  attribution: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
  },
  attributionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  attributionText: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray600,
    marginBottom: 2,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
