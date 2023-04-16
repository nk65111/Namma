import { useNavigation } from '@react-navigation/native'
import { View } from 'native-base'
import React, { useState } from 'react'
import { Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import OTPTextView from 'react-native-otp-textinput'
import { colors } from '../../utils/constant'

function OTPScreen() {
    const navigation = useNavigation()
    const [otp, setOtp] = useState('123')

    const handleOtp = (text) => {
        setOtp(text);
    }

    return (
        <Animated.View exiting={SlideInLeft} entering={SlideInRight} style={tw`flex-1 items-center justify-center relative`}>
                <LinearGradient colors={colors.gradient_blue} style={tw`flex-1 items-center justify-between h-full w-full relative`}>
                    <View style={tw`w-full`}>
                        <BackButton />

                        <View style={tw`mt-20`}>
                            <Text style={tw`text-white text-3xl font-semibold text-center`}>OTP Sent to</Text>
                            <Text style={tw`text-white text-2xl mt-1 text-center`}>your mobile number</Text>
                        </View>
                    </View>
                    <View style={tw`w-full bg-white rounded-t-3xl p-10 min-h-[420px] flex-col`}>
                        <Text style={tw`text-3xl font-medium text-center`}>Verify OTP</Text>
                        <View style={tw`flex-col items-center py-5 flex-grow`}>
                            <OTPTextView
                                handleTextChange={(e) => handleOtp(e)}
                                textInputStyle={tw`border border-b ${otp.toString().length == 6 ? 'border-blue-800' : 'border-gray-400'} text-xl rounded-xl p-2 ios:pb-3 w-10 h-12 text-center text-purple-900 font-medium`}
                                inputCount={5}
                                tintColor={colors.blue}
                                offTintColor={otp.toString().length == 5 ? colors.blue : colors.light_grey}
                                inputCellLength={1}
                            />
                        </View>

                        <View style={tw`flex-row items-center justify-between w-full`}>
                            <SecondaryButton disabled={!navigation.canGoBack()} text={'Back'} onPress={() => navigation.goBack()} />
                            <PrimaryButton text={"Continue"} onPress={() => navigation.navigate('AboutYou')} />
                        </View>
                    </View>
                </LinearGradient>
        </Animated.View>
    )
}

export default OTPScreen