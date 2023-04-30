import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import tw from 'twrnc'
import { colors } from '../utils/constant'
import { View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

function Splash({ setLoading }) {
  return (
    <LinearGradient colors={colors.gradient_blue} style={tw`flex-1 items-center justify-center h-full w-full`}>
      <AnimatedLottieView
        source={require('../assets/lottie/RoadTrip2.json')}
        autoPlay
        loop={true}
        resizeMode={"contain"}
      // onAnimationFinish={() => setLoading && setLoading(false)}
      />
      <View style={tw`absolute left-0 w-full text-center z-10 top-4/6`}>
        <Animated.Text entering={FadeIn.duration(1000)} style={tw`text-5xl text-white font-medium text-center`}>Raahi</Animated.Text>
      </View>
    </LinearGradient>
  )
}

export default Splash
