// App.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { apiService, Drug, SearchResult } from './src/services/api/Api';

export default function App() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      const result = await apiService.testConnection();
      setConnectionStatus(result.success ? '✅ Connected' : '❌ Offline');

      if (!result.success) {
        Alert.alert('Backend Offline', result.message);
      }
    } catch (error) {
      setConnectionStatus('❌ Error');
    }
  };

  const searchDrugs = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Error', 'Please enter a drug name');
      return;
    }

    setLoading(true);
    try {
      console.log(`Searching for: ${searchTerm}`);
      const result: SearchResult = await apiService.searchDrugs(searchTerm);

      console.log('Search result:', result);
      setDrugs(result.drugs);

      Alert.alert(
        'Search Complete',
        `Found ${result.drugs.length} result(s) for "${searchTerm}"`
      );
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Failed', error instanceof Error ? error.message : 'Unknown error');
    }
    setLoading(false);
  };

  const quickSearch = (term: string) => {
    setSearchTerm(term);
    // Auto-search when quick button is pressed
    setTimeout(() => {
      searchDrugs();
    }, 100);
  };

  const renderDrug = ({ item }: { item: Drug }) => (
    <View style={[
      styles.drugCard,
      { borderLeftColor: apiService.getRiskLevelColor(item.riskLevel) }
    ]}>
      <Text style={styles.drugName}>{item.name}</Text>

      <View style={[
        styles.riskBadge,
        { backgroundColor: apiService.getRiskLevelColor(item.riskLevel) }
      ]}>
        <Text style={styles.riskBadgeText}>
          {apiService.getRiskLevelText(item.riskLevel)}
        </Text>
      </View>

      <Text style={styles.riskDescription}>{item.riskDescription}</Text>

      <Text style={styles.drugSummary} numberOfLines={3}>
        {item.summary}
      </Text>

      {item.alternatives && item.alternatives.length > 0 && (
        <View style={styles.alternativesContainer}>
          <Text style={styles.alternativesTitle}>Alternatives:</Text>
          <Text style={styles.alternatives}>
            {item.alternatives.slice(0, 3).join(', ')}
          </Text>
        </View>
      )}

      <Text style={styles.lastUpdated}>
        Updated: {new Date(item.lastUpdated).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🤱 Lactafarma</Text>
          <Text style={styles.subtitle}>Drug Compatibility for Breastfeeding</Text>
          <Text style={styles.status}>Backend: {connectionStatus}</Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search Medications</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter drug name (e.g., paracetamol)"
              value={searchTerm}
              onChangeText={setSearchTerm}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchDrugs}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Search Buttons */}
          <View style={styles.quickSearchContainer}>
            <Text style={styles.quickSearchTitle}>Quick Search:</Text>
            <View style={styles.quickButtonsRow}>
              {['paracetamol', 'ibuprofen', 'aspirin', 'omeprazole'].map((drug) => (
                <TouchableOpacity
                  key={drug}
                  style={styles.quickButton}
                  onPress={() => quickSearch(drug)}
                  disabled={loading}
                >
                  <Text style={styles.quickButtonText}>{drug}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Results Section */}
        {drugs.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>
              Results ({drugs.length})
            </Text>
            <FlatList
              data={drugs}
              renderItem={renderDrug}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {/* Attribution */}
        <View style={styles.attribution}>
          <Text style={styles.attributionText}>
            Data source: e-lactancia.org (APILAM)
          </Text>
          <Text style={styles.disclaimer}>
            ⚠️ This information complements but does not replace medical advice.
            Always consult your healthcare provider.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  searchSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quickSearchContainer: {
    marginTop: 10,
  },
  quickSearchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#666',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickButtonText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  resultsSection: {
    margin: 20,
    marginTop: 0,
  },
  drugCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  drugName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  riskBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  riskBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  riskDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    fontWeight: '500',
  },
  drugSummary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 15,
  },
  alternativesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  alternativesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  alternatives: {
    fontSize: 14,
    color: '#555',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  attribution: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
  },
  attributionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  disclaimer: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
