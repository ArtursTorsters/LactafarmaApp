import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View
} from 'react-native';
import { LoadingSpinner } from './frontend/src/components/common/LoadingSpinner'
import { globalStyles } from './frontend/src/styles/styles'
import { AboutApp } from './frontend/src/components/aboutApp/AboutApp'
import { Contacts } from './frontend/src/components/contacts/contacts';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [loading, setLoading] = useState(false);

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <SafeAreaProvider>
    <SafeAreaView style={globalStyles.safeArea}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {loading && <LoadingSpinner />}
            <AboutApp />
            <Contacts />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
    </SafeAreaProvider>

  );
}
