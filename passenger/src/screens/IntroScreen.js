import React from 'react'
import { Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeIn } from 'react-native-reanimated'
import tw from 'twrnc'
import { SvgCssUri } from 'react-native-svg';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import PrimaryButton from '../components/PrimaryButton'

function IntroScreen() {
  const navigation = useNavigation()
  return (
    <Animated.View entering={FadeIn.duration(600)} style={tw`flex-1 items-center justify-center`}>
      <LinearGradient colors={['#007FFF', '#007FFF', '#0CAFFF', '#0CAFFF']} style={tw`flex-1 items-center justify-center h-full w-full relative`}>
        <View style={tw`flex-1 w-full px-10 py-20`}>
          <SvgCssUri
            style={tw`mx-auto w-full h-60`}
            uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/ruby.svg"
          />
        </View>
        <View style={tw`w-full p-10 absolute bottom-2 left-0`}>
          <Text style={tw`text-4xl font-medium text-white`}>Find Your</Text>
          <Text style={tw`text-5xl font-medium text-white`}>Travel Buddy</Text>
          <Text style={tw`text-lg font-medium text-white my-2`}>Join with Raahi and make your travel easy and efficient</Text>
          <PrimaryButton onPress={() => navigation.navigate('Login')} text={'Get Started'} />
        </View>
      </LinearGradient>
    </Animated.View>
  )
}

export default IntroScreen