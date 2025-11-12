import React from "react";
import { View, Text, Linking, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/styles";

export const Contacts: React.FC = () => {
    const { width } = useWindowDimensions();

    const openEmail = () => Linking.openURL("mailto:labsoftoasty@gmail.com");
    const openCoffee = () => Linking.openURL("https://www.buymeacoffee.com/yourusername");

    const fontSize = Math.max(13, width * 0.035); // slightly smaller for compact layout
    const iconSize = Math.max(16, width * 0.04);
    const gap = Math.min(16, width * 0.04);

    return (
        <View
            style={{
                borderTopWidth: 1,
                borderTopColor: "#E5E7EB",
                paddingHorizontal: width * 0.05,
                paddingVertical: 4,
                alignItems: "center",
                backgroundColor: "#fff",
            }}
        >
            {/* Horizontal Row */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap, // spacing between items
                }}
            >
                {/* Email */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="mail-outline" size={iconSize} color="#2563EB" style={{ marginRight: 4 }} />
                    <Text
                        style={{
                            fontSize: Math.max(11, width * 0.03),
                            color: "#9CA3AF",
                        }}

                        onPress={openEmail}
                        accessibilityRole="button"
                        accessibilityLabel="Send an email"
                    >
                        labsoftoasty@gmail.com
                    </Text>
                </View>

                {/* Divider Dot */}
                <Text style={{ color: "#D1D5DB", fontSize }}>•</Text>

                {/* Buy Me a Coffee */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="cafe-outline" size={iconSize} color="#F59E0B" style={{ marginRight: 4 }} />
                    <Text
                        style={{
                            fontSize: Math.max(11, width * 0.03),
                            color: "#9CA3AF",
                        }}
                        onPress={openCoffee}
                        accessibilityRole="button"
                        accessibilityLabel="Buy me a coffee link"
                    >
                        Buy Me a Coffee
                    </Text>
                </View>
            </View>

            {/* Footer note */}
            <Text
                style={{
                    fontSize: Math.max(11, width * 0.03),
                    color: "#9CA3AF",
                    marginTop: 2,
                    marginBottom: 0,
                    textAlign: "center",
                }}
            >
                © {new Date().getFullYear()} LactaMed — All rights reserved.
            </Text>
        </View>
    );
};
