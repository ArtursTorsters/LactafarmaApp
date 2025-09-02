import React from 'react';
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
    // handleBlur,
    handleFocus,
    handleDrugSelect,
    clearSelectedDrug,
  } = useSearchHooks();

  console.log('🔍 Search Component State:', {
    query,
    resultsCount: results.length,
    showResults,
    loading,
    error,
  });

  return (
    <View style={[globalStyles.medicalContainer, { flex: 1 }]}>
      {/* Fixed Header Section */}
      <View style={{
        backgroundColor: 'white',
        paddingBottom: 8,
        zIndex: 10,
      }}>
        <Text style={globalStyles.captionText}>Search for a medication</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Enter medication name..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          // onBlur={handleBlur}
          onFocus={handleFocus}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Loading State */}
        {loading && (
          <View style={{
            alignItems: 'center',
            paddingVertical: 20
          }}>
            <LoadingSpinner />
          </View>
        )}

        {/* Search Error */}
        {error && !loading && (
          <View style={{
            backgroundColor: '#FEF2F2',
            padding: 16,
            borderRadius: 8,
            marginTop: 8,
            borderLeftWidth: 4,
            borderLeftColor: '#EF4444'
          }}>
            <Text style={[globalStyles.errorText, {
              color: '#DC2626'
            }]}>
              {error}
            </Text>
          </View>
        )}
      </View>

      {/* Full Height Results Section */}
      {showResults && !loading && (
        <View style={{
          flex: 1, // Takes remaining space
          marginTop: 8,
        }}>
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[globalStyles.resultItem, {
                  backgroundColor: '#FFFFFF',
                  padding: 16,
                  marginVertical: 4,
                  borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                  minHeight: 60, // Reasonable minimum height per item
                }]}
                onPress={() => {
                  console.log('🔥 Item clicked:', item.name);
                  handleDrugSelect(item);
                }}
                activeOpacity={0.7}
              >
                <Text style={[globalStyles.bodyText, {
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: 4
                }]}>
                  {item.name}
                </Text>
                {item.category && (
                  <Text style={[globalStyles.category, {
                    color: '#6B7280',
                    fontSize: 12,
                    fontStyle: 'italic'
                  }]}>
                    {item.category}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              query.length >= 2 ? (
                <View style={{
                  alignItems: 'center',
                  paddingVertical: 32,
                  flex: 1,
                  justifyContent: 'center'
                }}>
                  <Text style={[globalStyles.bodyText, {
                    color: '#6B7280',
                    textAlign: 'center'
                  }]}>
                    No medications found for "{query}"
                  </Text>
                  <Text style={[globalStyles.captionText, {
                    color: '#9CA3AF',
                    textAlign: 'center',
                    marginTop: 4
                  }]}>
                    Try a different search term
                  </Text>
                </View>
              ) : null
            }
            style={{
              flex: 1, // Takes full available height
            }}
            contentContainerStyle={{
              flexGrow: 1, // Allows content to grow and fill space
            }}
            showsVerticalScrollIndicator={true}
            bounces={true}
          />
        </View>
      )}

      {/* Full Screen Empty State (when no search is active) */}
      {!showResults && !loading && query.length === 0 && (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
        }}>
          <Text style={[globalStyles.bodyText, {
            color: '#9CA3AF',
            textAlign: 'center',
            fontSize: 16,
            lineHeight: 24,
          }]}>
            Start typing to search for medications and their breastfeeding compatibility
          </Text>
        </View>
      )}

      {/* Loading Details Overlay */}
      {loadingDetails && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            padding: 24,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <LoadingSpinner />
            <Text style={[globalStyles.bodyText, {
              marginTop: 12,
              color: '#374151'
            }]}>
              Loading details...
            </Text>
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
