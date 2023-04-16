import React from 'react'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SvgCssUri } from 'react-native-svg'
import tw from 'twrnc'

function ComingSoon() {
    return (
        <Animated.View entering={FadeIn.duration(600)} style={tw`flex-1 items-center justify-center bg-white p-10`}>
            <SvgCssUri
                style={tw`mx-auto w-full h-60`}
                uri="https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg"
            />
        </Animated.View>
    )
}

export default ComingSoon
