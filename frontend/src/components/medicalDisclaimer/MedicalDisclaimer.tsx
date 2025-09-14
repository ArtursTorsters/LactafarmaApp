import React from 'react';
import { View, Text} from 'react-native';
import {  medicalDisclaimerStyles } from '../../styles/styles';

export const MedicalDisclaimer: React.FC = () => {
  return (
    <View style={medicalDisclaimerStyles.container}>
      <View style={medicalDisclaimerStyles.header}>
        <Text style={medicalDisclaimerStyles.title}>Important Medical Disclaimer</Text>
      </View>
      <Text style={medicalDisclaimerStyles.text}>
         ⚠️ This information does not substitute the advice of a healthcare professional.
        Always consult your doctor before making medication decisions during breastfeeding.
      </Text>
    </View>
  );
};
