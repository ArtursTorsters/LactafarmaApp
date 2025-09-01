// SearchInput.tsx
import React from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { DrugCard } from '../drugCard/DrugCard';
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
    handleBlur,
    handleFocus,
    handleDrugSelect,
    clearSelectedDrug,
  } = useSearchHooks();

  return (
    <View style={globalStyles.medicalContainer}>
      <Text style={globalStyles.captionText}>Search for a medication</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Search"
        value={query}
        onChangeText={setQuery}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />

      {loading && <LoadingSpinner />}
      {loadingDetails && <LoadingSpinner />}
      {error && <Text style={globalStyles.errorText}>{error}</Text>}

      {showResults && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={globalStyles.resultItem}
              onPress={() => handleDrugSelect(item)}
            >
              <Text style={globalStyles.bodyText}>{item.name}</Text>
              {item.category && <Text style={globalStyles.category}>{item.category}</Text>}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && query.length >= 2 ? (
              <Text style={globalStyles.errorText}>No results found</Text>
            ) : null
          }
        />
      )}

      {/* Drug Details Modal */}
      <Modal
        visible={!!selectedDrug}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          <View style={globalStyles.row}>
            <Text style={globalStyles.title}>Drug Information</Text>
            <TouchableOpacity
              onPress={clearSelectedDrug}
              style={{ padding: 8 }}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedDrugForUI && (
            <DrugCard
              drug={selectedDrugForUI}
              onPress={() => {}}
            />
          )}

          {/* Display additional details from DrugDetails */}
          {selectedDrug && (
            <View style={{ padding: 16 }}>
              {selectedDrug.riskDescription && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={globalStyles.title}>Risk Information</Text>
                  <Text style={globalStyles.bodyText}>{selectedDrug.riskDescription}</Text>
                </View>
              )}

              {selectedDrug.alternatives && selectedDrug.alternatives.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={globalStyles.title}>Alternatives</Text>
                  {selectedDrug.alternatives.map((alt: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                    <Text key={index} style={globalStyles.bodyText}>• {alt}</Text>
                  ))}
                </View>
              )}

              {selectedDrug.lastUpdate && (
                <Text style={globalStyles.captionText}>
                  Last updated: {selectedDrug.lastUpdate}
                </Text>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};
