import React from 'react'
import { Image } from 'react-native'
import Animated from 'react-native-reanimated'
import tw from 'twrnc'

function ComingSoon() {
    return (
        <Animated.View style={tw`flex-1 items-center justify-center bg-white p-10`}>
            <Image
                style={{ width: 360, height: 300 }}
                source={require('../assets/images/ComingSoon.gif')}
            />
        </Animated.View>
    )
}

export default ComingSoon