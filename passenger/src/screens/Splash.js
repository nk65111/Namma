import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import tw from 'twrnc'

function Splash({setLoading}) {
  return (
    <LinearGradient colors={['#007FFF', '#007FFF', '#0CAFFF', '#0CAFFF']} style={tw`flex-1 items-center justify-center h-full w-full`}>
      <AnimatedLottieView
        source={require('../assets/lottie/RoadTrip2.json')}
        autoPlay
        loop={false}
        resizeMode={"contain"}
        onAnimationFinish={() => setLoading(false)}
      />
    </LinearGradient>
  )
}

export default Splash
