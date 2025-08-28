// App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { DrugSearchComponent } from './frontend/src/components/searchInput/SearchInput'
import DrugSearchService from './frontend/src/services/DrugSearchService';
export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testHealth = async () => {
    setLoading(true);
    addResult('Testing health endpoint...');

    try {
      const response = await fetch('http://192.168.8.38:3000/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // timeout: 10000,
      });

      addResult(`Health response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        addResult(`Backend is healthy! Service: ${data.service}`);
        Alert.alert('Success', 'Backend connection successful!');
      } else {
        addResult(`Health check failed: ${response.statusText}`);
      }
    } catch (error) {
      const errorMsg = `Health check error: ${error.message}`;
      addResult(errorMsg);
      Alert.alert('Connection Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const testSearch = async () => {
    setLoading(true);
    addResult('Testing search endpoint...');

    try {
      const response = await fetch('http://192.168.8.38:3000/api/drugs/search/aspirin', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // timeout: 15000,
      });

      addResult(`Search response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        addResult(`Search successful! Found ${data.count} suggestions`);
        if (data.suggestions.length > 0) {
          addResult(`First result: ${data.suggestions[0].name}`);
        }
        Alert.alert('Success', `Found ${data.count} drug suggestions for "aspirin"`);
      } else {
        addResult(`Search failed: ${response.statusText}`);
      }
    } catch (error) {
      const errorMsg = `Search error: ${error.message}`;
      addResult(errorMsg);
      Alert.alert('Search Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Backend Connection Test</Text>
        <Text style={styles.subtitle}>Testing connection to 192.168.8.38:3000</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.healthButton]}
          onPress={testHealth}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Health Check</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.searchButton]}
          onPress={testSearch}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Drug Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Testing connection...</Text>
        </View>
      )}
      <DrugSearchComponent/>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        <ScrollView style={styles.resultsList}>
          {results.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))}
          {results.length === 0 && (
            <Text style={styles.noResults}>No tests run yet. Tap a button above to test.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthButton: {
    backgroundColor: '#4CAF50',
  },
  searchButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  resultsContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  resultsList: {
    flex: 1,
  },
  resultText: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noResults: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
