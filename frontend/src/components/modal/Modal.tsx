// components/modals/DrugDetailsModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { modalStyles } from "../../styles/styles";
import { RISK_LEVELS } from "../../utils/constants";
import { DrugDetailsModalProps, RiskLevel } from "../../types";

export const DrugDetailsModal: React.FC<DrugDetailsModalProps> = ({
  visible,
  selectedDrug,
  selectedDrugForUI,
  loadingDetails,
  error,
  onClose,
}) => {
  // Get risk level info for styling
  const riskLevelInfo = selectedDrugForUI ? RISK_LEVELS[selectedDrugForUI.riskLevel] : RISK_LEVELS.unknown;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        {/* Header */}
        <View style={modalStyles.header}>
          <Text style={modalStyles.headerTitle}>Drug Information</Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loadingDetails && (
          <View style={modalStyles.loadingContainer}>
            <LoadingSpinner />
            <Text style={modalStyles.loadingText}>Loading drug details...</Text>
          </View>
        )}

        {/* Error State */}
        {!loadingDetails && error && !selectedDrug && (
          <View style={modalStyles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={modalStyles.errorTitle}>Unable to Load Drug Details</Text>
            <Text style={modalStyles.errorText}>{error}</Text>
            <TouchableOpacity style={modalStyles.errorButton} onPress={onClose}>
              <Text style={modalStyles.errorButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        {!loadingDetails && selectedDrug && (
          <ScrollView
            style={modalStyles.scrollView}
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Drug Header Card */}
            <View style={modalStyles.drugHeaderCard}>
              {/* Drug Name */}
              <Text style={modalStyles.drugName}>{selectedDrug.name}</Text>

              {/* Risk Badge and Category */}
              <View style={modalStyles.riskBadgeContainer}>
                <View
                  style={[
                    modalStyles.riskBadge,
                    { backgroundColor: riskLevelInfo.color + '20' }
                  ]}
                >
                  <View
                    style={[
                      modalStyles.riskDot,
                      { backgroundColor: riskLevelInfo.color }
                    ]}
                  />
                  <Text
                    style={[
                      modalStyles.riskText,
                      { color: riskLevelInfo.color }
                    ]}
                  >
                    {riskLevelInfo.label}
                  </Text>
                </View>

                {selectedDrugForUI?.category && (
                  <Text style={modalStyles.category}>
                    {selectedDrugForUI.category}
                  </Text>
                )}
              </View>

              {/* Risk Description */}
              {selectedDrug.riskDescription && (
                <View style={modalStyles.riskDescriptionContainer}>
                  <Text style={modalStyles.riskDescriptionText}>
                    {selectedDrug.riskDescription}
                  </Text>
                </View>
              )}
            </View>

            {/* Description Section */}
            {selectedDrug.description && (
              <View style={modalStyles.descriptionCard}>
                <Text style={modalStyles.sectionLabel}>Description</Text>
                <Text style={modalStyles.descriptionText}>
                  {selectedDrug.description}
                </Text>
              </View>
            )}

            {/* Alternatives Section */}
            {selectedDrug.alternatives && selectedDrug.alternatives.length > 0 && (
              <View style={modalStyles.alternativesCard}>
                <View style={modalStyles.alternativesHeader}>
                  <Ionicons
                    name="swap-horizontal-outline"
                    size={20}
                    color="#059669"
                  />
                  <Text style={modalStyles.alternativesTitle}>Alternatives</Text>
                </View>
                {selectedDrug.alternatives.map((alt, index) => (
                  <View key={index} style={modalStyles.alternativeItem}>
                    <View style={modalStyles.alternativeBullet} />
                    <Text style={modalStyles.alternativeText}>{alt}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Last Update */}
            {selectedDrug.lastUpdate && (
              <View style={modalStyles.lastUpdateContainer}>
                <Text style={modalStyles.lastUpdateText}>
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
