import React from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { DrugDetailsModal } from "../modal/Modal";
import { useSearchHooks } from "../../hooks/SearchHooks";
import { globalStyles } from "../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { MedicalDisclaimer } from "../medicalDisclaimer/MedicalDisclaimer";
import { HapticFeedback } from "../../utils/haptics"; // ADD THIS

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
    isSearchModalVisible,
    handleFocus,
    handleDrugSelect,
    onBack,
    clearSelectedDrug,
    closeSearchModal,
  } = useSearchHooks();

  const { width } = useWindowDimensions();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isSearchModalVisible]);

  // Wrapped handlers with haptics
  const handleSearchPress = () => {
    HapticFeedback.medium();
    handleFocus();
  };

  const handleCloseModal = () => {
    HapticFeedback.medium();
    closeSearchModal();
  };

  const handleItemSelect = (item: any) => {
    HapticFeedback.selection();
    handleDrugSelect(item);
    closeSearchModal();
  };

  const handleBackPress = () => {
    HapticFeedback.medium();
    onBack();
  };

  return (
    <View style={[globalStyles.searchContainer, { flex: 1 }]}>
      <Animated.View
        style={[
          globalStyles.searchHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }) }],
          },
        ]}
      >
        <TouchableOpacity onPress={handleSearchPress} activeOpacity={0.8}>
          <View style={{ position: "relative" }}>
            <TextInput
              style={[
                globalStyles.input,
                {
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  paddingLeft: 40,
                },
              ]}
              placeholder="Enter medication name..."
              placeholderTextColor="#9CA3AF"
              value={query}
              editable={false}
              pointerEvents="none"
            />
            <Ionicons
              name="search"
              size={20}
              color="#6B7280"
              style={{ position: "absolute", left: 12, top: 10 }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {!isSearchModalVisible && (
        <View style={[globalStyles.searchFullScreenEmpty, { justifyContent: "center" }]}>
          <MedicalDisclaimer />
        </View>
      )}

      <Modal
        visible={isSearchModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              paddingTop: 50,
              borderBottomWidth: 1,
              borderBottomColor: "#E2E8F0",
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={[
                globalStyles.title,
                { fontSize: Math.max(20, width * 0.05), fontWeight: "600" },
              ]}
            >
              Search Medications
            </Text>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={{
                padding: 8,
                borderRadius: 10,
                backgroundColor: "#F1F5F9",
              }}
            >
              <Ionicons name="close" size={24} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={{ padding: 16 }}>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[
                  globalStyles.input,
                  {
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    borderRadius: 12,
                    paddingLeft: 40,
                    fontSize: Math.max(14, width * 0.04),
                  },
                ]}
                placeholder="Enter medication name..."
                placeholderTextColor="#9CA3AF"
                value={query}
                onChangeText={(text) => {
                  // Small haptic on each key press (optional)
                  if (text.length > query.length) {
                    HapticFeedback.selection();
                  }
                  setQuery(text);
                }}
                onFocus={() => HapticFeedback.medium()}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Ionicons
                name="search"
                size={20}
                color="#6B7280"
                style={{ position: "absolute", left: 12, top: 14 }}
              />
            </View>

            {loading && (
              <View style={globalStyles.searchLoadingContainer}>
                <LoadingSpinner />
              </View>
            )}

            {error && !loading && (
              <View style={globalStyles.searchErrorContainer}>
                <Text
                  style={[
                    globalStyles.errorText,
                    { color: "#DC2626", textAlign: "center" },
                  ]}
                >
                  {error}
                </Text>
              </View>
            )}
          </View>

          {/* Search Results */}
          {showResults && !loading && (
            <Animated.View
              style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <FlatList
                data={results}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#fff",
                      padding: 14,
                      marginVertical: 6,
                      borderRadius: 12,
                      shadowColor: "#000",
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                      flexDirection: "column",
                    }}
                    onPress={() => handleItemSelect(item)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        globalStyles.bodyText,
                        {
                          fontSize: Math.max(15, width * 0.04),
                          fontWeight: "500",
                          color: "#111827",
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {item.category && (
                      <Text
                        style={{
                          color: "#6B7280",
                          fontSize: Math.max(12, width * 0.035),
                          marginTop: 2,
                        }}
                      >
                        {item.category}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View
                    style={{
                      alignItems: "center",
                      marginTop: 80,
                    }}
                  >
                    <Ionicons name="medkit-outline" size={48} color="#94A3B8" />
                    <Text
                      style={{
                        color: "#475569",
                        fontSize: Math.max(15, width * 0.04),
                        marginTop: 10,
                        fontWeight: "500",
                      }}
                    >
                      {query.length >= 2
                        ? `No medications found for "${query}"`
                        : "Start typing to search for medications"}
                    </Text>
                    <Text
                      style={{
                        color: "#94A3B8",
                        fontSize: Math.max(13, width * 0.035),
                        marginTop: 4,
                      }}
                    >
                      Try a different search term
                    </Text>
                  </View>
                }
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                bounces
              />
            </Animated.View>
          )}
        </View>
      </Modal>

      {loadingDetails && (
        <View style={globalStyles.loadingDetailsOverlay}>
          <View style={globalStyles.loadingDetailsContent}>
            <LoadingSpinner />
          </View>
        </View>
      )}

      <DrugDetailsModal
        onBack={handleBackPress}
        visible={selectedDrug !== null}
        selectedDrug={selectedDrug}
        selectedDrugForUI={selectedDrugForUI}
        loadingDetails={loadingDetails}
        error={error}
        onClose={() => {
          HapticFeedback.medium();
          clearSelectedDrug();
        }}
      />
    </View>
  );
};
