import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import Animated from 'react-native-reanimated'
import tw from 'twrnc'

function ComingSoon2() {
    return (
        <Animated.View style={tw`flex-1 items-center justify-center bg-white p-10`}>
            <AnimatedLottieView
                source={require('../assets/lottie/ComingSoon.json')}
                autoPlay
                loop={true}
                resizeMode={"contain"}
            />

        </Animated.View>
    )
}

export default ComingSoon2