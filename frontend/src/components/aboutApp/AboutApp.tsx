import React from "react";
import { View, Text, Linking, ScrollView, useWindowDimensions } from "react-native";
import { globalStyles } from "../../styles/styles";
import { DrugSearchComponent } from "../searchInput/SearchInput";

export const AboutApp: React.FC = () => {
  const { width, height } = useWindowDimensions();

  const openELactancia = () => Linking.openURL("https://www.e-lactancia.org");
  const openLegal = () => Linking.openURL("https://www.e-lactancia.org/aviso_legal/");

  // --- Dynamic scaling based on width & height ---
  const scaleWidth = width / 375; // base width
  const scaleHeight = height / 812; // base height (iPhone X)
  const scale = Math.min(scaleWidth, scaleHeight); // choose smaller to avoid overflow

  const baseFont = 14 * scale;
  const titleFont = 20 * scale;
  const subtitleFont = 18 * scale;
  const lineHeight = baseFont * 1.45;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
      }}
      showsVerticalScrollIndicator
    >
      <View style={globalStyles.medicalContainer}>
        {/* About Section */}
        <Text
          style={[
            globalStyles.title,
            { fontSize: titleFont, marginBottom: height * 0.01, color: "#111827" },
          ]}
        >
          About LactaMed
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            { fontSize: baseFont, lineHeight, textAlign: "justify", color: "#374151" },
          ]}
        >
          LactaMed helps breastfeeding mothers quickly find reliable information about medication
          safety during lactation. It provides instant access to comprehensive drug compatibility
          data and scientific evidence. LactaMed uses this data in a non-commercial way, with proper
          attribution. Any derived information is distributed under the same license terms.
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            globalStyles.link,
            { marginTop: height * 0.015, textAlign: "left", fontSize: baseFont, color: "#2563EB" },
          ]}
          onPress={openLegal}
          accessibilityRole="button"
          accessibilityLabel="Read the legal notice on e-lactancia.org"
        >
          → View e-lactancia.org Legal Notice
        </Text>

        {/* Licensing Section */}
        <Text
          style={[
            globalStyles.title,
            { fontSize: subtitleFont, marginVertical: height * 0.015, color: "#111827" },
          ]}
        >
          Licensing & Usage
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            { fontSize: baseFont, lineHeight, textAlign: "justify", color: "#374151" },
          ]}
        >
          The medication data is sourced from{" "}
          <Text style={globalStyles.link} onPress={openELactancia}>
            e-lactancia.org
          </Text>{" "}
          (APILAM). Their content is published under the Creative Commons Attribution-NonCommercial-
          ShareAlike 4.0 International License (CC BY-NC-SA 4.0).
        </Text>

        {/* Drug Search */}
        <View style={{ marginTop: height * 0.02 }}>
          <DrugSearchComponent />
        </View>
      </View>
    </ScrollView>
  );
};
