import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/styles";
import { globalStyles } from '../../styles/styles'

interface AboutAppProps {
  style?: any;
}

export const AboutApp: React.FC<AboutAppProps> = ({ style }) => {
  const openELactancia = () => {
    Linking.openURL("https://www.e-lactancia.org");
  };

  return (
    <View style={[globalStyles.medicalContainer, style]}>
      <View style={globalStyles.cardHeader}>
        <Ionicons name="information-circle" size={24} color={colors.info} />
        <Text style={globalStyles.title}>About LactaFarma</Text>
      </View>

      <Text style={globalStyles.bodyText}>
        LactaFarma helps breastfeeding mothers quickly find reliable information
        about medication safety during lactation. Our app provides instant
        access to comprehensive drug compatibility data.
      </Text>

      <View style={globalStyles.medicalContainer}>
        <Text style={globalStyles.title}>Licensing & Usage</Text>
        <Text style={globalStyles.bodyText}>
          The medication data provided is sourced from{" "}
          <Text style={globalStyles.link} onPress={openELactancia}>
            e-lactancia.org
          </Text>{" "}
          (APILAM). Their content is published under the Creative Commons
          Attribution-NonCommercial-ShareAlike 4.0 International License (CC
          BY-NC-SA 4.0).
        </Text>
        <Text style={globalStyles.bodyText}>
          LactaFarma uses this data in a non-commercial way, with proper
          attribution, and any derivative information is distributed under the
          same license terms.
        </Text>
        <Text
          style={[globalStyles.bodyText, globalStyles.link]}
          onPress={() =>
            Linking.openURL("https://www.e-lactancia.org/aviso_legal/")
          }
          accessibilityRole="button"
          accessibilityLabel="Read the legal notice on e-lactancia.org"
        >
          → View e-lactancia.org Legal Notice
        </Text>
      </View>
    </View>
  );
};
