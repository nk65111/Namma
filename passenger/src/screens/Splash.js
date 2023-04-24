import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import tw from 'twrnc'
import { colors } from '../utils/constant'

function Splash({ setLoading }) {
  return (
    <LinearGradient colors={colors.gradient_blue} style={tw`flex-1 items-center justify-center h-full w-full`}>
      <AnimatedLottieView
        source={require('../assets/lottie/RoadTrip2.json')}
        autoPlay
        loop={false}
        resizeMode={"contain"}
        onAnimationFinish={() => setLoading && setLoading(false)}
      />
    </LinearGradient>
  )
}

export default Splash
