import React from "react";
import { View, Text, Linking, useWindowDimensions } from "react-native";
import { globalStyles } from "../../styles/styles";

export const MedicalDisclaimer: React.FC = () => {
  const { width, height } = useWindowDimensions();

  const openPolicy = () => Linking.openURL("https://arturstorsters.github.io/privacy-policy");
  const openTerms = () => Linking.openURL("https://arturstorsters.github.io/terms-of-service");

  const scaleWidth = width / 375;
  const scaleHeight = height / 812;
  const scale = Math.min(scaleWidth, scaleHeight);

  const baseFont = 13 * scale;
  const titleFont = 16 * scale;
  const lineHeight = baseFont * 1.4;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.018,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <Text style={{ fontSize: titleFont, fontWeight: "600", color: "#111827", marginBottom: 6 }}>
        Medical Disclaimer
      </Text>

      <Text style={{ fontSize: baseFont, lineHeight, color: "#374151", textAlign: "justify", marginBottom: 10 }}>
        ⚠️ This information does not substitute the advice of a healthcare professional. Always
        consult your doctor before making medication decisions during breastfeeding. This app provides
        general information and is not intended for medical diagnosis, treatment, or advice.
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 8 }}>
        <Text style={[globalStyles.link, { fontSize: baseFont, color: "#2563EB" }]} onPress={openPolicy} accessibilityRole="button">
          → Read Policy
        </Text>
        <Text style={[globalStyles.link, { fontSize: baseFont, color: "#2563EB" }]} onPress={openTerms} accessibilityRole="button">
          → Read Terms
        </Text>
      </View>
    </View>
  );
};
