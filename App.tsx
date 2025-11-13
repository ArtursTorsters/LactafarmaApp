import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
  SafeAreaView,
} from 'react-native';
import { LoadingSpinner } from './frontend/src/components/common/LoadingSpinner'
import { globalStyles } from './frontend/src/styles/styles'
import {AboutApp} from './frontend/src/components/aboutApp/AboutApp'
import { Contacts } from './frontend/src/components/contacts/contacts';

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
          <Contacts/>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
