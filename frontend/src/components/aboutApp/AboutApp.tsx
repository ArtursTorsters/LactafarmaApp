import React from "react";
import { View, Text, Linking, ScrollView, useWindowDimensions } from "react-native";
import { globalStyles } from "../../styles/styles";

export const AboutApp: React.FC = () => {
  const { width, height } = useWindowDimensions();

  const openELactancia = () => Linking.openURL("https://www.e-lactancia.org");
  const openLegal = () => Linking.openURL("https://www.e-lactancia.org/aviso_legal/");

  // 📏 Dynamically scale text sizes — slightly smaller for narrow screens
  const scale = width < 360 ? 0.9 : width < 400 ? 0.95 : 1;
  const baseFont = 14 * scale;
  const titleFont = 20 * scale;
  const subtitleFont = 18 * scale;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{
        paddingHorizontal: width * 0.05,
        paddingVertical: 16,
      }}
      showsVerticalScrollIndicator={true}
    >
      <View style={globalStyles.medicalContainer}>
        {/* --- Section: About --- */}
        <Text
          style={[
            globalStyles.title,
            {
              fontSize: titleFont,
              textAlign: "left",
              marginBottom: 8,
              color: "#111827",
            },
          ]}
        >
          About LactaMed
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            {
              fontSize: baseFont,
              lineHeight: baseFont * 1.45,
              textAlign: "justify",
              color: "#374151",
            },
          ]}
        >
          LactaMed helps breastfeeding mothers quickly find reliable information about medication
          safety during lactation. It provides instant access to comprehensive drug compatibility
          data and scientific evidence.
          LactaMed uses this data in a non-commercial way, with proper attribution. Any derived
          information is distributed under the same license terms.
        <Text
          style={[
            globalStyles.bodyText,
            globalStyles.link,
            {
              marginTop: 14,
              textAlign: "center",
              fontSize: baseFont,
              color: "#2563EB",
            },
          ]}
          onPress={openLegal}
          accessibilityRole="button"
          accessibilityLabel="Read the legal notice on e-lactancia.org"
        >
          → View e-lactancia.org Legal Notice
        </Text>
        </Text>

        {/* --- Section: Licensing --- */}
        <Text
          style={[
            globalStyles.title,
            {
              fontSize: subtitleFont,
              textAlign: "left",
              marginVertical: 10,
              color: "#111827",
            },
          ]}
        >
          Licensing & Usage
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            {
              fontSize: baseFont,
              lineHeight: baseFont * 1.45,
              textAlign: "justify",
              color: "#374151",
            },
          ]}
        >
          The medication data provided is sourced from{" "}
          <Text style={globalStyles.link} onPress={openELactancia}>
            e-lactancia.org
          </Text>{" "}
          (APILAM). Their content is published under the Creative Commons Attribution-NonCommercial-
          ShareAlike 4.0 International License (CC BY-NC-SA 4.0).
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            {
              fontSize: baseFont,
              lineHeight: baseFont * 1.45,
              marginTop: 8,
              textAlign: "justify",
              color: "#374151",
            },
          ]}
        >

        </Text>

        {/* --- Legal Link --- */}

      </View>
    </ScrollView>
  );
};
