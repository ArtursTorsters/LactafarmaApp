// SimpleApp.tsx - Clean, simple example without ScrollView conflicts
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SimpleDrugAutocomplete from './frontend/src/components/drugCard/DrugAutocomplete';

const App: React.FC = () => {
  const [selectedDrug, setSelectedDrug] = useState<string>('');

  // Use your actual IP address here
  const API_BASE_URL = 'http://192.168.8.38:3001/api';

  const handleDrugSelected = (drugName: string) => {
    console.log('Selected drug:', drugName);
    setSelectedDrug(drugName);

    Alert.alert(
      'Drug Selected',
      `You selected: ${drugName}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Drug Search</Text>
          <Text style={styles.subtitle}>Simple e-lactancia search</Text>
        </View>

        <View style={styles.searchContainer}>
          <SimpleDrugAutocomplete
            apiBaseUrl={API_BASE_URL}
            onDrugSelected={handleDrugSelected}
            placeholder="Type drug name (e.g., ibuprofen)..."
          />
        </View>

        {selectedDrug ? (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedLabel}>Last selected:</Text>
            <Text style={styles.selectedDrug}>{selectedDrug}</Text>
          </View>
        ) : null}

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>How to test:</Text>
          <Text style={styles.instructionText}>
            1. Type "ibu" - should suggest "Ibuprofen"
          </Text>
          <Text style={styles.instructionText}>
            2. Type "para" - should suggest "Paracetamol"
          </Text>
          <Text style={styles.instructionText}>
            3. Check the debug info below the search box
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    marginBottom: 20,
    // No nested ScrollView here!
  },
  selectedContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectedDrug: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  instructions: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginTop: 'auto',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default App;
