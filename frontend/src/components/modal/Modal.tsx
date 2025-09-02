import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { DrugCard } from "../drugCard/DrugCard";
import { globalStyles } from "../../styles/styles";
import { DrugDetailsModalProps } from "../../types";

export const DrugDetailsModal: React.FC<DrugDetailsModalProps> = ({
  visible,
  selectedDrug,
  selectedDrugForUI,
  loadingDetails,
  error,
  onClose,
}) => {

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        {/* Header */}
        <View
          style={[
            globalStyles.row,
            {
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E2E8F0",
              backgroundColor: "#FFFFFF",
            },
          ]}
        >
          <Text style={globalStyles.title}>Drug Information</Text>
          <TouchableOpacity
            onPress={() => {
              console.log("🔴 Closing modal");
              onClose();
            }}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: "#F1F5F9",
            }}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loadingDetails && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingSpinner />
            <Text
              style={[
                globalStyles.bodyText,
                {
                  marginTop: 16,
                  color: "#64748B",
                },
              ]}
            >
              Loading drug details...
            </Text>
          </View>
        )}

        {/* Error State */}
        {!loadingDetails && error && !selectedDrug && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}
          >
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text
              style={[
                globalStyles.title,
                {
                  color: "#EF4444",
                  marginTop: 16,
                  marginBottom: 8,
                  textAlign: "center",
                },
              ]}
            >
              Unable to Load Drug Details
            </Text>
            <Text
              style={[
                globalStyles.bodyText,
                {
                  textAlign: "center",
                  marginBottom: 24,
                  color: "#64748B",
                },
              ]}
            >
              {error}
            </Text>
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: "#3B82F6",
                borderRadius: 8,
              }}
              onPress={onClose}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        {!loadingDetails && selectedDrug && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Drug Card */}
            {selectedDrugForUI && (
              <View style={{ marginBottom: 24 }}>
                <DrugCard drug={selectedDrugForUI} onPress={() => {}} />
              </View>
            )}

            {/* Basic Drug Info */}
            <View
              style={{
                marginBottom: 24,
                backgroundColor: "#FFFFFF",
                padding: 16,
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text
                style={[
                  globalStyles.title,
                  {
                    marginBottom: 16,
                    color: "#1E293B",
                  },
                ]}
              >
                {selectedDrug.name}
              </Text>

              {selectedDrug.riskLevel && (
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={[
                      globalStyles.captionText,
                      {
                        fontWeight: "600",
                        marginBottom: 4,
                        color: "#475569",
                      },
                    ]}
                  >
                    Risk Level:
                  </Text>
                  <Text
                    style={[
                      globalStyles.bodyText,
                      {
                        color: "#1E293B",
                      },
                    ]}
                  >
                    {selectedDrug.riskLevel}
                  </Text>
                </View>
              )}

              {selectedDrug.description && (
                <View>
                  <Text
                    style={[
                      globalStyles.captionText,
                      {
                        fontWeight: "600",
                        marginBottom: 4,
                        color: "#475569",
                      },
                    ]}
                  >
                    Description:
                  </Text>
                  <Text
                    style={[
                      globalStyles.bodyText,
                      {
                        lineHeight: 22,
                        color: "#374151",
                      },
                    ]}
                  >
                    {selectedDrug.description}
                  </Text>
                </View>
              )}
            </View>

            {/* Risk Information */}
            {selectedDrug.riskDescription && (
              <View
                style={{
                  marginBottom: 24,
                  backgroundColor: "#FEF3C7",
                  padding: 16,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: "#F59E0B",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="warning-outline" size={20} color="#D97706" />
                  <Text
                    style={[
                      globalStyles.title,
                      {
                        marginLeft: 8,
                        color: "#92400E",
                        fontSize: 16,
                      },
                    ]}
                  >
                    Risk Information
                  </Text>
                </View>
                <Text
                  style={[
                    globalStyles.bodyText,
                    {
                      lineHeight: 22,
                      color: "#78350F",
                    },
                  ]}
                >
                  {selectedDrug.riskDescription}
                </Text>
              </View>
            )}

            {/* Alternatives */}
            {selectedDrug.alternatives &&
              selectedDrug.alternatives.length > 0 && (
                <View
                  style={{
                    marginBottom: 24,
                    backgroundColor: "#FFFFFF",
                    padding: 16,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name="swap-horizontal-outline"
                      size={20}
                      color="#059669"
                    />
                    <Text
                      style={[
                        globalStyles.title,
                        {
                          marginLeft: 8,
                          color: "#047857",
                          fontSize: 16,
                        },
                      ]}
                    >
                      Alternatives
                    </Text>
                  </View>
                  {selectedDrug.alternatives.map((alt, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#10B981",
                          marginRight: 12,
                        }}
                      />
                      <Text
                        style={[
                          globalStyles.bodyText,
                          {
                            flex: 1,
                            color: "#374151",
                          },
                        ]}
                      >
                        {alt}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

            {/* Last Update */}
            {selectedDrug.lastUpdate && (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 16,
                  borderTopWidth: 1,
                  borderTopColor: "#E5E7EB",
                  marginTop: 8,
                }}
              >
                <Text
                  style={[
                    globalStyles.captionText,
                    {
                      fontStyle: "italic",
                      color: "#9CA3AF",
                    },
                  ]}
                >
                  Last updated: {selectedDrug.lastUpdate}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};
