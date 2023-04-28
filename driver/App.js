import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import store from './src/slices/store'
import './src/utils/ignore'
import { Alert, BackHandler, Keyboard, Linking, Platform, SafeAreaView, Text, TouchableWithoutFeedback } from 'react-native'
import { notificationListener, requestUserPermission } from './src/utils/notificationService'
import VersionCheck from 'react-native-version-check'
import PushNotification from 'react-native-push-notification'
import { QueryClient, QueryClientProvider } from 'react-query';
import Routes from './src/Routes'
import { NativeBaseProvider, KeyboardAvoidingView } from "native-base";

const App = () => {
  const queryClient = new QueryClient()
  const disableBackButton = () => { return true }

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'raahi',
      channelName: 'raahi'
    })
  }


  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', disableBackButton)
    return BackHandler.removeEventListener('hardwareBackPress', disableBackButton)
  }, [])

  const checkUpdateNeeded = async () => {
    let updateNeeded = await VersionCheck.needUpdate()
    if (updateNeeded?.isNeeded) {
      Alert.alert('Please Update', 'You have to update app to the latest version to continue using....', [
        {
          text: 'Update',
          onPress: () => {
            BackHandler.exitApp()
            Linking.openURL(updateNeeded.storeUrl)
          },
        },
      ])
    }
  }

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    createChannels();
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <NativeBaseProvider>
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
                style={{ flex: 1 }}
              >
                <Routes />
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </NativeBaseProvider>
        </SafeAreaView>
      </Provider>
    </QueryClientProvider>
  )
}

export default App

