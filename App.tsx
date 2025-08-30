import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView
} from 'react-native';
import { DrugSearchComponent } from './frontend/src/components/searchInput/SearchInput'
import { LoadingSpinner } from './frontend/src/components/common/LoadingSpinner'
import { globalStyles } from './frontend/src/styles/styles'
import {MedicalDisclaimer} from './frontend/src/components/medicalDisclaimer/MedicalDisclaimer'
import {AboutApp} from './frontend/src/components/aboutApp/AboutApp'


export default function App() {
  const [loading, setLoading] = useState(false);

  return (

      <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {loading && <LoadingSpinner />}
        <AboutApp />
        <DrugSearchComponent />
        <MedicalDisclaimer/>
      </ScrollView>
    </SafeAreaView>


  );
}
