import React, { useState } from "react";
import {
  View,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  useWindowDimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/styles";
import { DrugSearchComponent } from "../searchInput/SearchInput";
import { HapticFeedback } from "../../utils/haptics";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const AboutApp: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [expandedSections, setExpandedSections] = useState({
    about: true,      // Only this is open by default
    disclaimer: false, // Closed by default
    licensing: false   // Closed by default
  });

  const openELactancia = () => Linking.openURL("https://www.e-lactancia.org");
  const openLegal = () => Linking.openURL("https://www.e-lactancia.org/aviso_legal/");

  // Update these with your actual URLs
  const openPolicy = () => Linking.openURL("https://your-privacy-policy-url.com");
  const openTerms = () => Linking.openURL("https://your-terms-of-service-url.com");

  const scaleWidth = width / 375;
  const scaleHeight = height / 812;
  const scale = Math.min(scaleWidth, scaleHeight);

  const baseFont = 14 * scale;
  const titleFont = 20 * scale;
  const subtitleFont = 18 * scale;
  const lineHeight = baseFont * 1.45;

  const toggleSection = (section: 'about' | 'disclaimer' | 'licensing') => {
    HapticFeedback.light();

    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleXY
      )
    );

    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.medicalContainer}>
        {/* About Section - OPEN BY DEFAULT */}
        <TouchableOpacity
          onPress={() => toggleSection('about')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: height * 0.01,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              globalStyles.title,
              { fontSize: titleFont, color: "#111827", flex: 1 },
            ]}
          >
            About LactaMed
          </Text>
          <Ionicons
            name={expandedSections.about ? "chevron-up" : "chevron-down"}
            size={24 * scale}
            color="#6B7280"
          />
        </TouchableOpacity>

        {expandedSections.about && (
          <View style={{ paddingTop: height * 0.01, paddingBottom: height * 0.015 }}>
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
          </View>
        )}

        <TouchableOpacity
          onPress={() => toggleSection('disclaimer')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: height * 0.01,
            marginTop: height * 0.005,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              globalStyles.title,
              { fontSize: subtitleFont, color: "#111827", flex: 1 },
            ]}
          >
            Medical Disclaimer
          </Text>
          <Ionicons
            name={expandedSections.disclaimer ? "chevron-up" : "chevron-down"}
            size={24 * scale}
            color="#6B7280"
          />
        </TouchableOpacity>

        {expandedSections.disclaimer && (
          <View
            style={{
              backgroundColor: "#ffffffff",
              borderWidth: 1,
              borderColor: "#FCA5A5",
              borderRadius: 12,
              paddingHorizontal: width * 0.04,
              paddingVertical: height * 0.015,
              marginTop: height * 0.01,
              marginBottom: height * 0.01,
            }}
          >
            <Text style={{
              fontSize: baseFont,
              lineHeight,
              color: "#000000ff",
              textAlign: "justify",
              marginBottom: 10
            }}>
              ⚠️ This information does not substitute the advice of a healthcare professional. Always
              consult your doctor before making medication decisions during breastfeeding. This app provides
              general information and is not intended for medical diagnosis, treatment, or advice.
            </Text>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-around",
              borderTopWidth: 1,
              borderTopColor: "#FCA5A5",
              paddingTop: 10
            }}>
              <TouchableOpacity onPress={openPolicy}>
                <Text style={[globalStyles.link, { fontSize: baseFont * 0.9, color: "#267bdcff" }]}>
                  → Privacy Policy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openTerms}>
                <Text style={[globalStyles.link, { fontSize: baseFont * 0.9, color: "#267bdcff" }]}>
                  → Terms of Service
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Licensing Section - CLOSED BY DEFAULT */}
        <TouchableOpacity
          onPress={() => toggleSection('licensing')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: height * 0.01,
            marginTop: height * 0.005,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              globalStyles.title,
              { fontSize: subtitleFont, color: "#111827", flex: 1 },
            ]}
          >
            Licensing & Usage
          </Text>
          <Ionicons
            name={expandedSections.licensing ? "chevron-up" : "chevron-down"}
            size={24 * scale}
            color="#6B7280"
          />
        </TouchableOpacity>

        {expandedSections.licensing && (
          <View style={{ paddingTop: height * 0.01 }}>
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
          </View>
        )}

        <View style={{ marginTop: height * 0.02 }}>
          <DrugSearchComponent />
        </View>
      </View>
    </ScrollView>
  );
};
