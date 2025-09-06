import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
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
    handleFocus,
    handleDrugSelect,
    clearSelectedDrug,
  } = useSearchHooks();

  // Determine if we should show fullscreen search
  const isSearchActive = query.length > 0 || showResults;
  const handleClearSearch = () => {
    setQuery('')
  };

  return (
    <View style={[
      globalStyles.searchContainer,
      { flex: 1 },
      isSearchActive && {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }
    ]}>
      <View style={[
        globalStyles.searchHeader,
        isSearchActive && {
          paddingTop: 50,
          paddingBottom: 16
        }
      ]}>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8
        }}>
          <Text style={globalStyles.captionText}>Search for a medication</Text>
          {isSearchActive && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#F1F5F9'
              }}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ position: 'relative' }}>
          <TextInput
            style={globalStyles.input}
            placeholder="Enter medication name..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            onFocus={handleFocus}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

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
        <View style={globalStyles.searchResultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={globalStyles.searchResultItem}
                onPress={() => handleDrugSelect(item)}
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
              ) : null
            }
            style={globalStyles.flatListContainer}
            contentContainerStyle={globalStyles.flatListContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          />
        </View>
      )}

      {/* Full Screen Empty State */}
      {!showResults && !loading && query.length === 0 && !isSearchActive && (
        <View style={globalStyles.searchFullScreenEmpty}>
          <Text style={[globalStyles.bodyText, globalStyles.searchFullScreenEmptyText]}>
            Start typing to search for medications and their breastfeeding compatibility
          </Text>
            <MedicalDisclaimer/>
        </View>
      )}

      {loadingDetails && (
        <View style={globalStyles.loadingDetailsOverlay}>
          <View style={globalStyles.loadingDetailsContent}>
            <LoadingSpinner />
          </View>
        </View>
      )}

      {/* Drug Details Modal */}
      <DrugDetailsModal
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
