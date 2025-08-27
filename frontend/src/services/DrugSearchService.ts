// // DrugSearchService.ts - React Native service
// export interface DrugSuggestion {
//   name: string;
//   url?: string;
//   category?: string;
// }

// export interface DrugDetails {
//   name: string;
//   riskLevel?: string;
//   riskDescription?: string;
//   alternatives?: string[];
//   lastUpdate?: string;
//   description?: string;
// }

// export class DrugSearchService {
//   private baseURL: string;

//   constructor(baseURL: string = 'https://your-backend-server.com') {
//     this.baseURL = baseURL;
//   }

//   async searchDrugs(query: string): Promise<DrugSuggestion[]> {
//     try {
//       const response = await fetch(`${this.baseURL}/api/drugs/search/${encodeURIComponent(query)}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         timeout: 15000, // 15 second timeout
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         return data.suggestions;
//       } else {
//         throw new Error(data.error || 'Search failed');
//       }
//     } catch (error) {
//       console.error('Drug search failed:', error);
//       throw error;
//     }
//   }

//   async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
//     try {
//       const response = await fetch(`${this.baseURL}/api/drugs/details/${encodeURIComponent(drugName)}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         timeout: 20000, // 20 second timeout for details
//       });

//       if (!response.ok) {
//         if (response.status === 404) {
//           return null; // Drug not found
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         return data.details;
//       } else {
//         throw new Error(data.error || 'Failed to get drug details');
//       }
//     } catch (error) {
//       console.error('Get drug details failed:', error);
//       throw error;
//     }
//   }
// }

// // React Native Component Example
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';

// const DrugSearchComponent: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [suggestions, setSuggestions] = useState<DrugSuggestion[]>([]);
//   const [selectedDrug, setSelectedDrug] = useState<DrugDetails | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingDetails, setIsLoadingDetails] = useState(false);

//   const drugService = useMemo(() => new DrugSearchService(), []);

//   // Debounced search function
//   useEffect(() => {
//     const delayedSearch = setTimeout(async () => {
//       if (searchQuery.trim().length >= 2) {
//         await handleSearch(searchQuery.trim());
//       } else {
//         setSuggestions([]);
//       }
//     }, 500); // 500ms delay

//     return () => clearTimeout(delayedSearch);
//   }, [searchQuery]);

//   const handleSearch = async (query: string) => {
//     setIsLoading(true);
//     try {
//       const results = await drugService.searchDrugs(query);
//       setSuggestions(results);
//     } catch (error) {
//       console.error('Search error:', error);
//       Alert.alert('Search Error', 'Failed to search for drugs. Please try again.');
//       setSuggestions([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSelectDrug = async (suggestion: DrugSuggestion) => {
//     setIsLoadingDetails(true);
//     setSelectedDrug(null);

//     try {
//       const details = await drugService.getDrugDetails(suggestion.name);
//       setSelectedDrug(details);
//     } catch (error) {
//       console.error('Details error:', error);
//       Alert.alert('Error', 'Failed to get drug details. Please try again.');
//     } finally {
//       setIsLoadingDetails(false);
//     }
//   };

//   const renderSuggestion = ({ item }: { item: DrugSuggestion }) => (
//     <TouchableOpacity
//       style={styles.suggestionItem}
//       onPress={() => handleSelectDrug(item)}
//     >
//       <Text style={styles.suggestionText}>{item.name}</Text>
//       {item.category && (
//         <Text style={styles.categoryText}>{item.category}</Text>
//       )}
//     </TouchableOpacity>
//   );

//   const renderDrugDetails = () => {
//     if (isLoadingDetails) {
//       return (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0066cc" />
//           <Text>Loading drug details...</Text>
//         </View>
//       );
//     }

//     if (!selectedDrug) return null;

//     return (
//       <View style={styles.detailsContainer}>
//         <Text style={styles.drugName}>{selectedDrug.name}</Text>

//         {selectedDrug.riskLevel && (
//           <View style={styles.riskContainer}>
//             <Text style={styles.riskLabel}>Risk Level:</Text>
//             <Text style={[styles.riskLevel, getRiskLevelStyle(selectedDrug.riskLevel)]}>
//               {selectedDrug.riskLevel}
//             </Text>
//           </View>
//         )}

//         {selectedDrug.description && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Description:</Text>
//             <Text style={styles.description}>{selectedDrug.description}</Text>
//           </View>
//         )}

//         {selectedDrug.alternatives && selectedDrug.alternatives.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Alternatives:</Text>
//             {selectedDrug.alternatives.map((alt, index) => (
//               <Text key={index} style={styles.alternative}>• {alt}</Text>
//             ))}
//           </View>
//         )}

//         {selectedDrug.lastUpdate && (
//           <Text style={styles.lastUpdate}>Last updated: {selectedDrug.lastUpdate}</Text>
//         )}
//       </View>
//     );
//   };

//   const getRiskLevelStyle = (riskLevel: string) => {
//     const level = riskLevel.toLowerCase();
//     if (level.includes('safe') || level.includes('green')) return styles.riskSafe;
//     if (level.includes('caution') || level.includes('yellow')) return styles.riskCaution;
//     if (level.includes('danger') || level.includes('red')) return styles.riskDanger;
//     return styles.riskUnknown;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Drug Safety Search</Text>

//       <TextInput
//         style={styles.searchInput}
//         placeholder="Type drug name (e.g., aspirin, ibuprofen)"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         autoCapitalize="none"
//         autoCorrect={false}
//       />

//       {isLoading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="small" color="#0066cc" />
//           <Text>Searching...</Text>
//         </View>
//       )}

//       {suggestions.length > 0 && (
//         <View style={styles.suggestionsContainer}>
//           <Text style={styles.suggestionsTitle}>Suggestions:</Text>
//           <FlatList
//             data={suggestions}
//             keyExtractor={(item, index) => `${item.name}-${index}`}
//             renderItem={renderSuggestion}
//             style={styles.suggestionsList}
//             keyboardShouldPersistTaps="handled"
//           />
//         </View>
//       )}

//       {renderDrugDetails()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   searchInput: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginBottom: 10,
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//   },
//   suggestionsContainer: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 20,
//     maxHeight: 200,
//   },
//   suggestionsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   suggestionsList: {
//     flexGrow: 0,
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   suggestionText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   categoryText: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   detailsContainer: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     marginTop: 10,
//   },
//   drugName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//     textAlign: 'center',
//   },
//   riskContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     justifyContent: 'center',
//   },
//   riskLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginRight: 10,
//     color: '#333',
//   },
//   riskLevel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   riskSafe: {
//     backgroundColor: '#4CAF50',
//     color: 'white',
//   },
//   riskCaution: {
//     backgroundColor: '#FF9800',
//     color: 'white',
//   },
//   riskDanger: {
//     backgroundColor: '#F44336',
//     color: 'white',
//   },
//   riskUnknown: {
//     backgroundColor: '#9E9E9E',
//     color: 'white',
//   },
//   section: {
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 20,
//   },
//   alternative: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   lastUpdate: {
//     fontSize: 12,
//     color: '#999',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     marginTop: 10,
//   },
// });

// export default DrugSearchComponent;
