import React from "react";
import { View, Text, Linking } from "react-native";
import { globalStyles } from '../../styles/styles'


export const AboutApp: React.FC = ({  }) => {
  const openELactancia = () => {
    Linking.openURL("https://www.e-lactancia.org")
  }
   const openLegal = () => {
    Linking.openURL("https://www.e-lactancia.org/aviso_legal/")
  }

  return (
    <View style={[globalStyles.medicalContainer]}>
      <View style={globalStyles.medicalContainer}>
        <Text style={globalStyles.title}>About LactaMed</Text>
      <Text style={globalStyles.bodyText}>
        LactaMed helps breastfeeding mothers quickly find reliable information
        about medication safety during lactation. LactaMed provides instant
        access to comprehensive drug compatibility data.
      </Text>
        <Text style={globalStyles.title}>Licensing & Usage</Text>
        <Text style={globalStyles.bodyText}>
          The medication data provided is sourced from:{" "}
          <Text style={globalStyles.link} onPress={openELactancia}>
            → e-lactancia.org
          </Text>{" "}
          (APILAM). Their content is published under the Creative Commons
          Attribution-NonCommercial-ShareAlike 4.0 International License (CC
          BY-NC-SA 4.0).
        </Text>
        <Text style={globalStyles.bodyText}>
          LactaMed uses this data in a non-commercial way, with proper
          attribution, and any derivative information is distributed under the
          same license terms.
        </Text>
        <Text
          style={[globalStyles.bodyText, globalStyles.link]}
          onPress={openLegal}
          accessibilityRole="button"
          accessibilityLabel="Read the legal notice on e-lactancia.org"

        >
          → View e-lactancia.org Legal Notice
        </Text>
      </View>
    </View>
  );
};
