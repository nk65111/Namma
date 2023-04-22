import { useNavigation } from '@react-navigation/native'
import { View } from 'native-base'
import React, { useState } from 'react'
import { Text, Vibration } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import OTPTextView from 'react-native-otp-textinput'
import { colors } from '../../utils/constant'
import AsyncStorage from '@react-native-async-storage/async-storage'

function OTPScreen({ route }) {
    const navigation = useNavigation()
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    const validateToken = async () => {
        setLoading(true);
        // await apiauth
        //   .getData()
        //   .then(response => {
        //     const onboardingCount = response.data.onBoardProcessCount;
        //     navigation.navigate(Data[onboardingCount]);
        //     setLoading(false)
        //   })
        //   .catch(error => {
        //     setLoading(false);
        //   });
    }
    const handleSubmit = async () => {
        setLoading(false);
        if (otp === undefined || otp === "") {
            Vibration.vibrate(300);
            setError(true);
        } else {
            let data = {};
            data["mobile"] = route.params?.mobile;
            data["otp"] = otp;
            data["fcmToken"] = await AsyncStorage.getItem('fcmToken');
            // apiauth
            //     .verifyPhoneOtp(data)
            //     .then(async response => {
            //         if (response.status === 200) {
            //             setError(false);
            //             setLoading(false);
            //             try {
            //                 await AsyncStorage.setItem("token", response.data.token);
            //                  save user in reducer

            //             } catch (err) {
            //                 console.log("asyncstorage err", err);
            //             }
            //             validateToken();
            //         } else {
            //             setLoading(false);
            //             Vibration.vibrate(300);
            //             setError(true);
            //         }
            //     })
            //     .catch(error => {
            //         setLoading(false);
            //         Vibration.vibrate(300);
            //         setError(true);
            //     });
        }
    };



    const handleOtp = (text) => {
        setOtp(text);
    }

    return (
        <Animated.View exiting={SlideInLeft} entering={SlideInRight} style={tw`flex-1 items-center justify-center relative`}>
            <LinearGradient colors={colors.gradient_blue} style={tw`flex-1 items-center justify-between h-full w-full relative`}>
                <View style={tw`w-full`}>
                    <BackButton extra={'m-3 ml-5'} />

                    <View style={tw`mt-20`}>
                        <Text style={tw`text-white text-3xl font-semibold text-center`}>OTP Sent to</Text>
                        <Text style={tw`text-white text-2xl mt-1 text-center`}>{ route.params?.mobile ? `+91 ${ route.params?.mobile}` :'your mobile number'}</Text>
                    </View>
                </View>
                <View style={tw`w-full bg-white rounded-t-3xl p-10 min-h-[420px] flex-col`}>
                    <Text style={tw`text-3xl font-medium text-center`}>Verify OTP</Text>
                    <View style={tw`flex-col items-center py-5 flex-grow`}>
                        <OTPTextView
                            handleTextChange={(e) => handleOtp(e)}
                            textInputStyle={[tw`border border-b ${otp.toString().length == 5 ? 'border-blue-800' : 'border-gray-200'} text-xl rounded-xl p-2 ios:pb-3 w-10 h-12 text-center font-medium`, { color: colors.blue }]}
                            inputCount={5}
                            tintColor={colors.blue}
                            offTintColor={otp.toString().length == 5 ? colors.blue : colors.grey}
                            inputCellLength={1}
                        />
                        <Text style={tw`text-center text-red-400 text-base mt-4`}>{error}</Text>
                    </View>

                    <View style={tw`flex-row items-center justify-between w-full`}>
                        <SecondaryButton disabled={!navigation.canGoBack()} text={'Back'} onPress={() => navigation.goBack()} extra='my-6' />
                        <PrimaryButton text={"Continue"} onPress={() => navigation.navigate('AboutYou')} extra='my-6' />
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    )
}

export default OTPScreen