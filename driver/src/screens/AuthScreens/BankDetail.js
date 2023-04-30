import { useNavigation } from '@react-navigation/native'
import { Box, FormControl, Input, Stack } from 'native-base'
import React, { useState } from 'react'
import { Alert, Text, View, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { colors } from '../../utils/constant'
import { DriverKycService } from '../../services';
import { SetLocalStorage } from '../../helpers/FunctionHelper';

const BankDetail = () => {
    const navigator = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        bankAccountNumber: '',
        ifscCode: '',
        accountHolderName: ''
    })

    const handleSubmit = () => {
        if (formData?.bankName || formData?.bankAccountNumber || formData?.accountHolderName || formData?.ifscCode) {
            bankDetailSubmit(formData);
        } else {
            Alert.alert('', 'Please fill all the details',
                [{ text: 'Ok' }, {}],
                {
                    cancelable: true,
                })
        }
    }

    const bankDetailSubmit = (formData) => {
        DriverKycService.updateBankDetail(formData)
            .then((data) => {
                console.log("bank detail ---", data);
                SetLocalStorage('DRIVER_DATA', JSON.stringify(data));
                navigator.navigate('VEHICLE_DETAIL');
            })
            .finally(() => setIsLoading(false))
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
            <LinearGradient colors={colors.gradient_blue} style={tw`flex-1 items-center h-full w-full relative`}>
                <View style={tw`w-full`}>
                    <BackButton extra={'m-3 ml-5'} />

                    <View style={tw`mt-20 mb-6`}>
                        <Text style={tw`text-white text-3xl font-semibold text-center`}>Add Your Details</Text>
                    </View>
                </View>

                <View style={tw`w-full bg-white rounded-t-3xl p-10 h-full flex-col min-h-[420px]`}>
                    <Box w="100%" maxWidth="300px" style={tw`mb-4`}>
                        <FormControl isRequired>
                            <Stack mx="4">
                                <FormControl.Label>Bank Name</FormControl.Label>
                                <Input placeholder="Name" value={formData?.bankName} onChangeText={(txt) => setFormData({ ...formData, bankName: txt })} style={tw`p-2 text-base ios:mb-2`} />
                                <FormControl.ErrorMessage>
                                    Name must contain only letters
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>
                    </Box>
                    <Box w="100%" maxWidth="300px" style={tw`mb-4`}>
                        <FormControl isRequired>
                            <Stack mx="4">
                                <FormControl.Label>Account Number</FormControl.Label>
                                <Input placeholder="DL14 20110012345" maxLength={16} value={formData?.bankAccountNumber} onChangeText={(txt) => setFormData({ ...formData, bankAccountNumber: txt })} style={tw`p-2 text-base ios:mb-2`} />
                                <FormControl.ErrorMessage>
                                    Invalid Format
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>
                    </Box>
                    <Box w="100%" maxWidth="300px" style={tw`mb-4`}>
                        <FormControl isRequired>
                            <Stack mx="4">
                                <FormControl.Label>IFSC</FormControl.Label>
                                <Input placeholder="TN 75 AA 7106" maxLength={10} value={formData?.ifscCode} onChangeText={(txt) => setFormData({ ...formData, ifscCode: txt })} style={tw`p-2 text-base ios:mb-2`} />
                                <FormControl.ErrorMessage>
                                    Invalid Format
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>
                    </Box>
                    <Box w="100%" maxWidth="300px" style={tw`mb-4`}>
                        <FormControl isRequired>
                            <Stack mx="4">
                                <FormControl.Label>Accountholder Name</FormControl.Label>
                                <Input placeholder="Account holder name" value={formData?.accountHolderName} onChangeText={(txt) => setFormData({ ...formData, accountHolderName: txt })} style={tw`p-2 text-base ios:mb-2`} />
                                <FormControl.ErrorMessage>
                                    Invalid Format
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>
                    </Box>

                    <View style={tw`flex-row items-center justify-between w-full pt-1`}>
                        <SecondaryButton disabled={!navigator.canGoBack()} text={'Back'} onPress={() => navigator.goBack()} extra='my-6' />
                        <PrimaryButton text={"Continue"} disabled={isLoading} onPress={handleSubmit} extra='my-6' />
                    </View>
                </View>

            </LinearGradient>
        </Animated.View>
    )
}

export default BankDetail;