import React, { useState } from 'react'
import { View } from 'native-base'
import { Text, Vibration, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import OTPTextView from 'react-native-otp-textinput'

import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

import { SetLocalStorage, GetLocalStorage } from '../../helpers/FunctionHelper';
import { colors } from '../../utils/constant'
import { AuthService } from '../../services';

function OTPScreen({ route }) {
    const navigation = useNavigation()
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const onVerify = async () => {
        if (otp === undefined || otp === "" || otp?.length !== 6) {
            Vibration.vibrate(300);
            setError("Invalid OTP");
        } else {
            setIsLoading(true);
            AuthService.verifyOtp({
                phoneNumber: route.params?.phoneNumber,
                otp: otp
            }).then(data => {
                console.log(data)
                onSuccess(data)
            }).catch(e => console.log("Verify otp ", e))
            .finally(() => setIsLoading(false)); 
        }
    };

    const onSuccess = (data) => {
        const { customer, token } = data;
        SetLocalStorage('IS_AUTH', '1');
        SetLocalStorage('DRIVER_DATA', JSON.stringify(customer));
        SetLocalStorage('AUTH_TOKEN_KEY', token);

        if (customer?.kycStatus === 'COMPLETED') {
            navigation.navigate('HomeScreen');
        } else {
            navigation.navigate(customer?.onboardingStep || 'DRIVING_LICENCE');
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
                        <Text style={tw`text-white text-3xl font-semibold text-center`}>OTP Sent to</Text>
                        <Text style={tw`text-white text-2xl mt-1 text-center`}>{route.params?.phoneNumber ? `+91 ${route.params?.phoneNumber}` : 'your mobile number'}</Text>
                    </View>
                </View>
                <View style={tw`w-full bg-white rounded-t-3xl p-10 min-h-[420px] flex-col`}>
                    <Text style={tw`text-3xl font-medium text-center`}>Verify OTP</Text>
                    <View style={tw`flex-col items-center py-5 flex-grow`}>
                        <OTPTextView
                            handleTextChange={(e) => setOtp(e)}
                            textInputStyle={[tw`border border-b ${otp.toString().length == 5 ? 'border-blue-800' : 'border-gray-200'} text-xl rounded-xl p-2 ios:pb-3 w-10 h-12 text-center font-medium`, { color: colors.blue }]}
                            inputCount={6}
                            tintColor={colors.blue}
                            offTintColor={otp.toString().length == 5 ? colors.blue : colors.grey}
                            inputCellLength={1}
                        />
                        <Text style={tw`text-center text-red-400 text-base mt-4`}>{error}</Text>
                    </View>

                    <View style={tw`flex-row items-center justify-between w-full`}>
                        <SecondaryButton disabled={!navigation.canGoBack()} text={'Back'} onPress={() => navigation.goBack()} extra='my-6' />
                        <PrimaryButton text={"Continue"} disabled={isLoading} onPress={onVerify} extra='my-6' />
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    )
}

export default OTPScreen