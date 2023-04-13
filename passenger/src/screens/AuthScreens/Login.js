import { useNavigation } from '@react-navigation/native'
import { View, Box, FormControl, Stack, Input } from 'native-base'
import React from 'react'
import { Keyboard, Text, TouchableWithoutFeedback } from 'react-native'
import { } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeIn } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'

function Login() {
    const navigation = useNavigation();
    return (
        <Animated.View entering={FadeIn} style={tw`flex-1 items-center justify-center relative`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <LinearGradient colors={['#007FFF', '#007FFF', '#0CAFFF', '#0CAFFF']} style={tw`flex-1 items-center justify-between h-full w-full relative`}>
                    <View style={tw`w-full`}>
                        <BackButton />

                        <View style={tw`mt-20`}>
                            <Text style={tw`text-white text-4xl font-semibold text-center`}>Welcome Back!</Text>
                            <Text style={tw`text-white text-xl mt-1 text-center`}>Log in to continue</Text>
                        </View>
                    </View>
                    <View style={tw`w-full bg-white rounded-t-3xl p-10 min-h-[420px] flex-col`}>
                        <Text style={tw`text-3xl font-medium text-center`}>Enter Mobile Number</Text>
                        <View style={tw`flex-col items-center py-5 flex-grow`}>
                            <Box w="100%" maxWidth="300px" style={tw``}>
                                <FormControl isRequired>
                                    <Stack mx="4">
                                        <View style={tw`relative`}>
                                            <Text style={tw`absolute top-1.5 h-full left-2.5 text-base py-1.5`}>+91</Text>
                                            <Input keyboardType={'number-pad'} type="number" placeholder="9878797936" style={tw`py-2 pl-12 text-base ios:mb-2`} />
                                        </View>
                                        <FormControl.HelperText>
                                        </FormControl.HelperText>
                                        <FormControl.ErrorMessage>
                                            10 Digits are required
                                        </FormControl.ErrorMessage>
                                    </Stack>
                                </FormControl>
                            </Box>
                        </View>
                        <PrimaryButton onPress={() => navigation.navigate('OTP')} text={"Send OTP"} extra={'px-10 mx-auto'} />
                    </View>
                </LinearGradient>
            </TouchableWithoutFeedback>
        </Animated.View>
    )
}

export default Login