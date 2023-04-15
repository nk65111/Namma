import { useNavigation } from '@react-navigation/native'
import { View, Box, FormControl, Stack, Input } from 'native-base'
import React from 'react'
import { Keyboard, Text, TouchableWithoutFeedback } from 'react-native'
import { } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

function OTPScreen() {
    const navigation = useNavigation()
    return (
        <Animated.View exiting={SlideInLeft} entering={SlideInRight} style={tw`flex-1 items-center justify-center relative`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <LinearGradient colors={['#007FFF', '#007FFF', '#0CAFFF', '#0CAFFF']} style={tw`flex-1 items-center justify-between h-full w-full relative`}>
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
                            <Box w="100%" maxWidth="300px" style={tw``}>
                                <FormControl isRequired>
                                    <Stack mx="4">
                                        <Input keyboardType={'number-pad'} type="number" placeholder="" letterSpacing={6} style={tw`p-2 text-center text-lg ios:mb-3`} />
                                        <FormControl.HelperText>
                                        </FormControl.HelperText>
                                        <FormControl.ErrorMessage>
                                            OTP must be of 6 Digits
                                        </FormControl.ErrorMessage>
                                    </Stack>
                                </FormControl>
                            </Box>
                        </View>
                        <View style={tw`flex-row items-center justify-between w-full`}>
                            <SecondaryButton disabled={!navigation.canGoBack()} text={'Back'} onPress={() => navigation.goBack()} />
                            <PrimaryButton text={"Continue"} onPress={() => navigation.navigate('AboutYou')} />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableWithoutFeedback>
        </Animated.View>
    )
}

export default OTPScreen