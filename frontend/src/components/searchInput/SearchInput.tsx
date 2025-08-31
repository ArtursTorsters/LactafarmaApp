import React from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useSearchHooks } from '../../hooks/SearchHooks';
import { globalStyles } from '../../styles/styles'


export const DrugSearchComponent = () => {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    handleBlur,
    handleFocus,
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

      {loading && <LoadingSpinner/>}
      {error && <Text style={globalStyles.errorText}>{error}</Text>}

      {showResults && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={globalStyles.resultItem}>
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
    </View>
  );
}
