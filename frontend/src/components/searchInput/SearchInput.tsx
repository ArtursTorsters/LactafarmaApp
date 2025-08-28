// src/components/DrugSearchComponent.tsx

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import drugSearchService, { DrugSuggestion } from '../../services/DrugSearchService';

export const DrugSearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DrugSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (text: string) => {
    setQuery(text);
    setError(null);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const suggestions = await drugSearchService.searchDrugs(text);
      setResults(suggestions);
    } catch (err: any) {
      setError(err?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search for a drug:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type at least 2 letters..."
        value={query}
        onChangeText={handleSearch}
      />

      {loading && <ActivityIndicator style={{ marginTop: 10 }} size="small" color="#007AFF" />}

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem}>
            <Text style={styles.resultText}>{item.name}</Text>
            {item.category && <Text style={styles.category}>{item.category}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && query.length >= 2 ? (
            <Text style={styles.noResults}>No results found</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  noResults: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
