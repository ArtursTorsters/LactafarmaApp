// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { colors, typography, spacing, globalStyles } from '../../styles/styles'
// import { RISK_LEVELS } from '../../utils/constants';
// import type { Drug, RiskLevel, DrugCardProps } from '../../types/index';

// export const DrugCard: React.FC<DrugCardProps> = ({
//     selectedDrug,

//   drug,
//   onPress,
// }) => {
//   const riskLevelInfo = RISK_LEVELS[drug.riskLevel]

//   return (
//     <TouchableOpacity
//       style={styles.container}
//       onPress={() => onPress(drug)}
//       accessibilityLabel={`Medication: ${drug.name}`}
//       accessibilityHint="Tap to view detailed information"
//       accessibilityRole="button"
//     >
//       <View style={styles.header}>
//         <View style={styles.titleContainer}>
//           <Text style={styles.drugName} numberOfLines={1}>
//             {drug.name}
//           </Text>
//           {drug.scientificName && (
//             <Text style={styles.scientificName} numberOfLines={1}>
//               {drug.scientificName}
//             </Text>
//           )}
//         </View>
//       </View>

//                {/* top header card */}
//                   {selectedDrug?.riskDescription && (
//                     <View style={globalStyles.modalRiskInfoCard}>
//                       <View style={globalStyles.modalRiskInfoHeader}>
//                         {/* <Ionicons name="warning-outline" size={20} color="#D97706" /> */}
//                         {/* <Text style={[globalStyles.title, globalStyles.modalRiskInfoTitle]}>
//                           Risk Information
//                         </Text> */}
//                       </View>
//                       <Text style={[globalStyles.bodyText, globalStyles.modalRiskInfoText]}>
//                         {selectedDrug.riskDescription}
//                       </Text>
//                     </View>
//                   )}

//       {/* {drug.description && (
//         <Text style={styles.description} numberOfLines={2}>
//           {drug.description}
//         </Text>
//       )} */}

//       <View style={styles.footer}>
//         <View
//           style={[
//             styles.riskBadge,
//             { backgroundColor: riskLevelInfo.color + '20' }
//           ]}
//         >
//           <View
//             style={[
//               styles.riskDot,
//               { backgroundColor: riskLevelInfo.color }
//             ]}
//           />
//           <Text
//             style={[
//               styles.riskText,
//               { color: riskLevelInfo.color }
//             ]}
//           >
//             {riskLevelInfo.label}
//           </Text>
//         </View>

//         {drug.category && (
//           <Text style={styles.category}>
//             {drug.category}
//           </Text>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: spacing.md,
//     marginBottom: spacing.sm,
//     borderWidth: 1,
//     borderColor: colors.gray200,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: spacing.sm,
//   },
//   titleContainer: {
//     flex: 1,
//   },
//   drugName: {
//     fontSize: typography.fontSizes.xl,
//     fontWeight: typography.fontWeights.bold,
//     color: colors.gray800,
//     marginBottom: 2,
//   },
//   scientificName: {
//     fontSize: typography.fontSizes.sm,
//     color: colors.gray600,
//     fontStyle: 'italic',
//   },
//   favoriteButton: {
//     padding: spacing.xs,
//     marginLeft: spacing.sm,
//   },
//   description: {
//     fontSize: typography.fontSizes.sm,
//     color: colors.gray600,
//     lineHeight: typography.lineHeights.normal * typography.fontSizes.sm,
//     marginBottom: spacing.sm,
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   riskBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: spacing.sm,
//     paddingVertical: spacing.xs,
//     borderRadius: 16,
//   },
//   riskDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: spacing.xs,
//   },
//   riskText: {
//     fontSize: typography.fontSizes.base,
//     fontWeight: typography.fontWeights.bold,
//   },
//   category: {
//     fontSize: typography.fontSizes.xs,
//     color: colors.gray500,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
// });
