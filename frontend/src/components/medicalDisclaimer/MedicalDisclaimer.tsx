import React from "react";
import { View, Text, Linking } from "react-native";
import { globalStyles, medicalDisclaimerStyles } from "../../styles/styles";

export const MedicalDisclaimer: React.FC = () => {
  const openPolicy = () => {
    Linking.openURL("https://arturstorsters.github.io/privacy-policy");
  };
  const openTerms = () => {
    Linking.openURL("https://arturstorsters.github.io/terms-of-service");
  };

  return (
    <View style={medicalDisclaimerStyles.container}>
      <View style={medicalDisclaimerStyles.header}>
        <Text style={medicalDisclaimerStyles.title}>
          Important Medical Disclaimer
        </Text>
      </View>
      <Text style={medicalDisclaimerStyles.text}>
        ⚠️ This information does not substitute the advice of a healthcare
        professional. Always consult your doctor before making medication
        decisions during breastfeeding.
        <Text>
          This app provides general information and is not intended
          for medical diagnosis, treatment, or advice. Information is
          for educational purposes only.
        </Text>
      </Text>

      <View
        style={[
          {
            justifyContent: 'space-between',
            flexDirection: 'row',
          },
        ]}>

        <Text
          style={[globalStyles.bodyText, globalStyles.link]}
          onPress={openPolicy}
          accessibilityRole="button"
          accessibilityLabel="Read our policy"
        >
          → Read policy
        </Text>
        <Text
          style={[globalStyles.bodyText, globalStyles.link]}
          onPress={openTerms}
          accessibilityRole="button"
          accessibilityLabel="Read our terms"
        >
          → Read terms
        </Text>
      </View>
    </View>
  );
};
