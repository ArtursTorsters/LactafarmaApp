import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { modalStyles } from "../../styles/styles";
import { RISK_LEVELS } from "../../utils/constants";
import { DrugDetailsModalProps, RiskLevel } from "../../types";
import { ErrorMessage } from "../common/ErrorMessage";

interface DrugDetailsModalPropsWithBack extends DrugDetailsModalProps {
  onBack?: () => void;
}

export const DrugDetailsModal: React.FC<DrugDetailsModalPropsWithBack> = ({
  visible,
  selectedDrug,
  selectedDrugForUI,
  loadingDetails,
  error,
  onClose,
  onBack,
}) => {
  const riskLevelInfo = selectedDrugForUI ? RISK_LEVELS[selectedDrugForUI.riskLevel] : RISK_LEVELS.unknown;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        {/* Header with Back and Close buttons */}
        <View style={modalStyles.header}>
          {/* Left side - Back button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {onBack && (
              <TouchableOpacity
                onPress={onBack}
                style={[modalStyles.closeButton, { marginRight: 12 }]}
              >
                <Ionicons name="arrow-back" size={24} color="#666" />
              </TouchableOpacity>
            )}
            <Text style={[modalStyles.headerTitle, { flex: 1 }]}>
              Drug Information
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {loadingDetails && (
          <View style={modalStyles.loadingContainer}>
            <LoadingSpinner />
            <Text style={modalStyles.loadingText}>Loading drug details...</Text>
          </View>
        )}

        {!loadingDetails && error && !selectedDrug && (
          <View style={modalStyles.errorContainer}>
          <ErrorMessage
            message="Unable to Load Drug Details"
            onPress={onClose}
            retryText="Close"
          />
          </View>
        )}

        {!loadingDetails && selectedDrug && (
          <ScrollView
            style={modalStyles.scrollView}
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Drug Header Card */}
            <View style={[
              modalStyles.drugHeaderCard,
              {
                borderLeftWidth: 6,
                borderLeftColor: riskLevelInfo.color,
                borderTopWidth: 2,
                borderTopColor: riskLevelInfo.color + '40',
              }
            ]}>
              <Text style={modalStyles.drugName}>{selectedDrug.name}</Text>

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
                <View style={[
                  modalStyles.riskDescriptionContainer,
                  {
                    borderColor: riskLevelInfo.color + '40',
                  }
                ]}>
                  <Text style={[
                    modalStyles.riskDescriptionText,
                  ]}>
                    {selectedDrug.riskDescription}
                  </Text>
                </View>
              )}
            </View>

            {selectedDrug.description && (
              <View style={modalStyles.descriptionCard}>
                <Text style={modalStyles.sectionLabel}>Description</Text>
                <Text style={modalStyles.descriptionText}>
                  {selectedDrug.description}
                </Text>
              </View>
            )}

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
