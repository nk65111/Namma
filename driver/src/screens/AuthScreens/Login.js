import { useNavigation } from '@react-navigation/native'
import { View, Box, FormControl, Stack, Input } from 'native-base'
import React from 'react'
import { Text, Vibration } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import { colors } from '../../utils/constant'
import { useState } from 'react'

// regex for valid number
const MobileNumberRegex = RegExp(/^[6-9]\d{9}$/i)

function Login() {
    const navigator = useNavigation();
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState('')

    function handleTextChange(value) {
        setMobile(value)
    }

    function isValid() {
        let errors = ''
        if (mobile === '') {
            errors = 'Mobile Number is required';
            setError(errors)
            Vibration.vibrate(300);
            return false
        } else if (!MobileNumberRegex.test(mobile)) {
            errors = 'Not a valid Mobile Number';
            setError(errors)
            Vibration.vibrate(300);
            return false
        }
        else { return true }
    }

    const handleSubmit = async () => {
        if (isValid() && mobile?.length == 10) {
            setLoading(true)
            let data = {}
            data['mobile'] = mobile
            // await apiauth
            //     .loginUser(data)
            //     .then((response) => {
            //         if (response.status === 200) {
            //             navigator.navigate('OTP', {
            //                 mobile: mobile,
            //             })
            //             setMobile('')
            //             setLoading(false)
            //         }
            //     })
            //     .catch((error) => {
            //         setLoading(false)
            //         Vibration.vibrate(300);
            //         setError(error?.response?.data?.message)
            //     })
        } else {
            Vibration.vibrate(300);
            setError('Invalid Phone Number')
        }
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
                                        <Input keyboardType={'number-pad'} maxLength={10} type="number" value={mobile} onChangeText={handleTextChange} placeholder="9878797936" style={[tw`py-2 pl-12 text-lg ios:mb-2`, { letterSpacing: 2 }]} />
                                    </View>
                                </Stack>
                            </FormControl>
                        </Box>
                        <Text style={tw`text-center text-red-400 text-base`}>{error}</Text>
                    </View>
                    <PrimaryButton onPress={() => navigator.navigate('OTP')} text={"Send OTP"} extra={'px-10 mx-auto my-6'} />
                </View>
            </LinearGradient>
        </Animated.View>
    )
}

export default Login