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
      <View style={globalStyles.modalContainer}>
        {/* Header */}
        <View style={[globalStyles.row, globalStyles.modalHeader]}>
          <Text style={globalStyles.title}>Drug Information</Text>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={globalStyles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loadingDetails && (
          <View style={globalStyles.modalLoadingContainer}>
            <LoadingSpinner />
            <Text style={[globalStyles.bodyText, globalStyles.modalLoadingText]}>
              Loading drug details...
            </Text>
          </View>
        )}

        {/* Error State */}
        {!loadingDetails && error && !selectedDrug && (
          <View style={globalStyles.modalErrorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={[globalStyles.title, globalStyles.modalErrorTitle]}>
              Unable to Load Drug Details
            </Text>
            <Text style={[globalStyles.bodyText, globalStyles.modalErrorText]}>
              {error}
            </Text>
            <TouchableOpacity
              style={globalStyles.modalErrorButton}
              onPress={onClose}
            >
              <Text style={globalStyles.modalErrorButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        {!loadingDetails && selectedDrug && (
          <ScrollView
            style={globalStyles.modalScrollView}
            contentContainerStyle={globalStyles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Drug Card */}
            {selectedDrugForUI && (
              <View style={globalStyles.modalDrugCardContainer}>
                <DrugCard drug={selectedDrugForUI} onPress={() => {}} />
              </View>
            )}

            {/* Basic Drug Info */}
            <View style={globalStyles.modalBasicInfoCard}>
              <Text style={[globalStyles.title, globalStyles.modalDrugTitle]}>
                {selectedDrug.name}
              </Text>

              {selectedDrug.riskLevel && (
                <View style={globalStyles.modalRiskLevelContainer}>
                  <Text style={[globalStyles.captionText, globalStyles.modalRiskLevelLabel]}>
                    Risk Level:
                  </Text>
                  <Text style={[globalStyles.bodyText, globalStyles.modalRiskLevelText]}>
                    {selectedDrug.riskLevel}
                  </Text>
                </View>
              )}

              {selectedDrug.description && (
                <View>
                  <Text style={[globalStyles.captionText, globalStyles.modalDescriptionLabel]}>
                    Description:
                  </Text>
                  <Text style={[globalStyles.bodyText, globalStyles.modalDescriptionText]}>
                    {selectedDrug.description}
                  </Text>
                </View>
              )}
            </View>

            {/* Risk Information */}
            {selectedDrug.riskDescription && (
              <View style={globalStyles.modalRiskInfoCard}>
                <View style={globalStyles.modalRiskInfoHeader}>
                  <Ionicons name="warning-outline" size={20} color="#D97706" />
                  <Text style={[globalStyles.title, globalStyles.modalRiskInfoTitle]}>
                    Risk Information
                  </Text>
                </View>
                <Text style={[globalStyles.bodyText, globalStyles.modalRiskInfoText]}>
                  {selectedDrug.riskDescription}
                </Text>
              </View>
            )}

            {/* Alternatives */}
            {selectedDrug.alternatives && selectedDrug.alternatives.length > 0 && (
              <View style={globalStyles.modalAlternativesCard}>
                <View style={globalStyles.modalAlternativesHeader}>
                  <Ionicons
                    name="swap-horizontal-outline"
                    size={20}
                    color="#059669"
                  />
                  <Text style={[globalStyles.title, globalStyles.modalAlternativesTitle]}>
                    Alternatives
                  </Text>
                </View>
                {selectedDrug.alternatives.map((alt, index) => (
                  <View key={index} style={globalStyles.modalAlternativeItem}>
                    <View style={globalStyles.modalAlternativeBullet} />
                    <Text style={[globalStyles.bodyText, globalStyles.modalAlternativeText]}>
                      {alt}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Last Update */}
            {selectedDrug.lastUpdate && (
              <View style={globalStyles.modalLastUpdateContainer}>
                <Text style={[globalStyles.captionText, globalStyles.modalLastUpdateText]}>
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
