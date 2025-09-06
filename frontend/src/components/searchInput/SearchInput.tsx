import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { DrugDetailsModal } from '../modal/Modal';
import { useSearchHooks } from '../../hooks/SearchHooks';
import { globalStyles } from '../../styles/styles';
import { Ionicons } from "@expo/vector-icons";
import { MedicalDisclaimer } from '../medicalDisclaimer/MedicalDisclaimer';

export const DrugSearchComponent = () => {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    selectedDrug,
    selectedDrugForUI,
    loadingDetails,
    isSearchModalVisible,
    handleFocus,
    handleDrugSelect,
    onBack,
    clearSelectedDrug,
    closeSearchModal,
  } = useSearchHooks();

  return (
    <View style={globalStyles.searchContainer}>
      {/* Regular Search Input */}
      <View style={globalStyles.searchHeader}>
        <Text style={globalStyles.captionText}>Search for a medication</Text>

        <TouchableOpacity onPress={handleFocus}>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter medication name..."
              placeholderTextColor="#9CA3AF"
              value={query}
              editable={false}
              pointerEvents="none"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {!isSearchModalVisible && (
        <View style={globalStyles.searchFullScreenEmpty}>
          <Text style={[globalStyles.bodyText, globalStyles.searchFullScreenEmptyText]}>
            Start typing to search for medications and their breastfeeding compatibility
          </Text>
          <MedicalDisclaimer/>
        </View>
      )}

      {/* Search Modal that opens on focus */}
      <Modal
        visible={isSearchModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeSearchModal}
      >
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          {/* Modal Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            paddingTop: 50,
            borderBottomWidth: 1,
            borderBottomColor: '#E2E8F0',
            backgroundColor: '#FFFFFF',
          }}>
            {/* open modal with empty search */}
            <Text style={globalStyles.title}>Search Medications</Text>
            <TouchableOpacity
              onPress={closeSearchModal}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#F1F5F9'
              }}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Modal Search Input */}
          <View style={{ padding: 16 }}>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter medication name..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              autoFocus={true} // Auto focus when modal opens
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Loading State */}
            {loading && (
              <View style={globalStyles.searchLoadingContainer}>
                <LoadingSpinner />
              </View>
            )}

            {/* Search Error */}
            {error && !loading && (
              <View style={globalStyles.searchErrorContainer}>
                <Text style={[globalStyles.errorText, { color: '#DC2626' }]}>
                  {error}
                </Text>
              </View>
            )}
          </View>

          {/* Results Section */}
          {showResults && !loading && (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <FlatList
                data={results}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={globalStyles.searchResultItem}
                    onPress={() => {
                      handleDrugSelect(item);
                      closeSearchModal()
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[globalStyles.bodyText, globalStyles.searchResultItemText]}>
                      {item.name}
                    </Text>
                    {item.category && (
                      <Text style={[globalStyles.category, globalStyles.searchResultItemCategory]}>
                        {item.category}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  query.length >= 2 ? (
                    <View style={globalStyles.searchEmptyStateContainer}>
                      <Text style={[globalStyles.bodyText, globalStyles.searchEmptyStateText]}>
                        No medications found for "{query}"
                      </Text>
                      <Text style={[globalStyles.captionText, globalStyles.searchEmptyStateSubtext]}>
                        Try a different search term
                      </Text>
                    </View>
                  ) : (
                    <View style={globalStyles.searchEmptyStateContainer}>
                      <Text style={[globalStyles.bodyText, globalStyles.searchEmptyStateText]}>
                        Start typing to search for medications
                      </Text>
                    </View>
                  )
                }
                style={globalStyles.flatListContainer}
                contentContainerStyle={globalStyles.flatListContent}
                showsVerticalScrollIndicator={true}
                bounces={true}
              />
            </View>
          )}
        </View>
      </Modal>

      {/* Loading Details Overlay */}
      {loadingDetails && (
        <View style={globalStyles.loadingDetailsOverlay}>
          <View style={globalStyles.loadingDetailsContent}>
            <LoadingSpinner />
          </View>
        </View>
      )}

      {/* Drug Details Modal */}
      <DrugDetailsModal
        onBack={onBack}
        visible={selectedDrug !== null}
        selectedDrug={selectedDrug}
        selectedDrugForUI={selectedDrugForUI}
        loadingDetails={loadingDetails}
        error={error}
        onClose={clearSelectedDrug}
      />
    </View>
  );
};
