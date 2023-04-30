import React, { useState } from 'react'
import { Text, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { View, Box, FormControl, Stack, Input } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import { colors } from '../../utils/constant';

import { showToast } from '../../helpers/FunctionHelper';
import { isValidMobile } from '../../common/validation';
import { isEmpty } from 'lodash';
import { AuthService } from '../../services';

function Login() {
    const navigator = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSendOtp = () => {
        if (isEmpty(phoneNumber) && !isValidMobile(phoneNumber)) {
            showToast("Please enter valid mobile number");
        } else {
            setIsLoading(true);
            AuthService.sendOtp(phoneNumber)
                .then(() => {
                    console.log("mobile", phoneNumber)
                    navigator.navigate('OTP', { phoneNumber: phoneNumber });
                })
                .finally(() => setIsLoading(false))
        }
    }

    if (isLoading) {
        return (
            <>
                <View style={tw`flex-1 items-center justify-center`}>
                    <ActivityIndicator size={30} />
                </View>
            </>
        )
    }

    return (

        <Animated.View exiting={SlideInLeft} entering={SlideInRight} style={tw`flex-1 items-center justify-center relative`}>
            <LinearGradient colors={colors.gradient_blue} style={tw`flex-1 items-center justify-between h-full w-full relative`}>
                <View style={tw`w-full`}>
                    <BackButton extra={'m-3 ml-5'} />

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
                                <Stack mx="4" style={tw`py-4`}>
                                    <View style={tw`relative`}>
                                        <Text style={tw`absolute top-0.5 h-full left-2.5 text-lg py-1.5`}>+91</Text>
                                        <Input
                                            keyboardType={'number-pad'}
                                            maxLength={10}
                                            type="number"
                                            value={phoneNumber}
                                            onChangeText={(val) => setPhoneNumber(val)} placeholder="9878797936"
                                            style={[tw`py-2 pl-12 text-lg ios:mb-2`,
                                            { letterSpacing: 2 }]}
                                        />
                                    </View>
                                </Stack>
                            </FormControl>
                        </Box>
                        {/* <Text style={tw`text-center text-red-400 text-base`}>{error}</Text> */}
                    </View>
                    <PrimaryButton disabled={isLoading} onPress={onSendOtp} text={"Send OTP"} extra={'px-10 mx-auto my-6'} />
                </View>
            </LinearGradient>
        </Animated.View>
    )
}

export default Login