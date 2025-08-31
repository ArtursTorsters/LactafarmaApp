import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
  SafeAreaView,
} from 'react-native';
import { DrugSearchComponent } from './frontend/src/components/searchInput/SearchInput'
import { LoadingSpinner } from './frontend/src/components/common/LoadingSpinner'
import { globalStyles } from './frontend/src/styles/styles'
import {MedicalDisclaimer} from './frontend/src/components/medicalDisclaimer/MedicalDisclaimer'
import {AboutApp} from './frontend/src/components/aboutApp/AboutApp'

export default function App() {
  const [loading, setLoading] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {loading && <LoadingSpinner />}
          <AboutApp />
          <DrugSearchComponent />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <MedicalDisclaimer/>
    </SafeAreaView>
  );
}
