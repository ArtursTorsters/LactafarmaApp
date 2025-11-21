import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View
} from 'react-native';
import { cache } from './frontend/src/utils/cache';
import { LoadingSpinner } from './frontend/src/components/common/LoadingSpinner'
import { globalStyles } from './frontend/src/styles/styles'
import { AboutApp } from './frontend/src/components/aboutApp/AboutApp'
import { Contacts } from './frontend/src/components/contacts/contacts';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [loading, setLoading] = useState(false);

  const dismissKeyboard = () => Keyboard.dismiss();
  // useEffect(() => {
  //   // Clear the entire cache on app start
  //   cache.clearAll().then(() => {
  //     console.log('Cache cleared!');
  //   });
  // }, []);
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
