// // SimpleDrugAutocomplete.tsx - Much cleaner and simpler version
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';

// interface DrugSuggestion {
//   id: string;
//   name: string;
//   displayName: string;
// }

// interface SimpleDrugAutocompleteProps {
//   apiBaseUrl: string;
//   onDrugSelected?: (drugName: string) => void;
//   placeholder?: string;
// }

// const SimpleDrugAutocomplete: React.FC<SimpleDrugAutocompleteProps> = ({
//   apiBaseUrl,
//   onDrugSelected,
//   placeholder = "Search for a drug..."
// }) => {
//   const [searchText, setSearchText] = useState('');
//   const [suggestions, setSuggestions] = useState<DrugSuggestion[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   // Simple debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchText.length >= 2) {
//         searchDrugs(searchText);
//       } else {
//         setSuggestions([]);
//         setShowSuggestions(false);
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchText]);

//   const searchDrugs = async (term: string) => {
//     setIsLoading(true);

//     try {
//       console.log(`Searching for: ${term}`);
//       const response = await fetch(`${apiBaseUrl}/autocomplete/${encodeURIComponent(term)}`);
//       const data = await response.json();

//       console.log('API Response:', data);

//       if (data.success && data.data.suggestions) {
//         setSuggestions(data.data.suggestions.slice(0, 5)); // Limit to 5 suggestions
//         setShowSuggestions(true);
//       } else {
//         setSuggestions([]);
//         setShowSuggestions(false);
//       }
//     } catch (error) {
//       console.error('Search failed:', error);
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }

//     setIsLoading(false);
//   };

//   const handleSuggestionPress = (suggestion: DrugSuggestion) => {
//     setSearchText(suggestion.displayName);
//     setShowSuggestions(false);
//     onDrugSelected?.(suggestion.displayName);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Search Input */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder={placeholder}
//           value={searchText}
//           onChangeText={setSearchText}
//           autoCapitalize="none"
//           autoCorrect={false}
//         />
//         {isLoading && <ActivityIndicator size="small" color="#666" style={styles.loader} />}
//       </View>

//       {/* Simple suggestions list - NO FlatList, just map */}
//       {showSuggestions && suggestions.length > 0 && (
//         <View style={styles.suggestionsContainer}>
//           {suggestions.map((suggestion, index) => (
//             <TouchableOpacity
//               key={suggestion.id || index}
//               style={styles.suggestionItem}
//               onPress={() => handleSuggestionPress(suggestion)}
//             >
//               <Text style={styles.suggestionText}>{suggestion.displayName}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* Debug info */}
//       {__DEV__ && (
//         <View style={styles.debug}>
//           <Text style={styles.debugText}>
//             API: {apiBaseUrl} | Suggestions: {suggestions.length}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     zIndex: 1000,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   loader: {
//     marginRight: 12,
//   },
//   suggestionsContainer: {
//     position: 'absolute',
//     top: '100%',
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderTopWidth: 0,
//     borderColor: '#ddd',
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//     maxHeight: 200,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     zIndex: 1001,
//   },
//   suggestionItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   debug: {
//     marginTop: 8,
//     padding: 8,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 4,
//   },
//   debugText: {
//     fontSize: 12,
//     color: '#666',
//     fontFamily: 'monospace',
//   },
// });

// export default SimpleDrugAutocomplete;
