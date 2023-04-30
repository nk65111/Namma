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
import { SetLocalStorage } from '../../helpers/FunctionHelper';
import { DriverKycService } from '../../services';

const VehicalDetail = () => {
    const navigator = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        drivingLicenseNumber: '',
        vehicleRegistrationNumber: '',
        vehicleModel: ''
    })

    const handleSubmit = () => {
        if (formData?.name || formData?.drivingLicenseNumber || formData?.vehicleModel || formData?.vehicleRegistrationNumber)
            vehicalDetailSubmit(formData);
        else
            Alert.alert('', 'Please fill all the details',
                [{ text: 'Ok' }, {}],
                {
                    cancelable: true,
                })
    }

    const vehicalDetailSubmit = (formData) => {
        DriverKycService.updateVehicleDetail(formData)
            .then((data) => {
                console.log("vehicle detail ---", data);
                SetLocalStorage('DRIVER_DATA', JSON.stringify(data));
                navigator.navigate('PROFILE_PIC');
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
                                <FormControl.Label>Your Name</FormControl.Label>
                                <Input placeholder="Name" value={formData?.name} onChangeText={(txt) => setFormData({ ...formData, name: txt })} style={tw`p-2 text-base ios:mb-2`} />
                                <FormControl.ErrorMessage>
                                    Name must contain only letters
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>
                    </Box>
                    <Box w="100%" maxWidth="300px" style={tw`mb-4`}>
                        <FormControl isRequired>
                            <Stack mx="4">
                                <FormControl.Label>Driving Liscence Number</FormControl.Label>
                                <Input placeholder="DL14 20110012345" maxLength={16} value={formData?.drivingLicenseNumber} onChangeText={(txt) => setFormData({ ...formData, drivingLicenseNumber: txt })} style={tw`p-2 text-base ios:mb-2`} />
                                <FormControl.ErrorMessage>
                                    Invalid Format
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>
                    </Box>
                    <Box w="100%" maxWidth="300px" style={tw`mb-4`}>
                        <FormControl isRequired>
                            <Stack mx="4">
                                <FormControl.Label>Vehicle Register Number</FormControl.Label>
                                <Input placeholder="TN 75 AA 7106" maxLength={10} value={formData?.vehicleRegistrationNumber} onChangeText={(txt) => setFormData({ ...formData, vehicleRegistrationNumber: txt })} style={tw`p-2 text-base ios:mb-2`} />
                                <FormControl.ErrorMessage>
                                    Invalid Format
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>
                    </Box>
                    <Box w="100%" maxWidth="300px" style={tw`mb-4`}>
                        <FormControl isRequired>
                            <Stack mx="4">
                                <FormControl.Label>Vehicle Model</FormControl.Label>
                                <Input placeholder="Honda Civic" value={formData?.vehicleModel} onChangeText={(txt) => setFormData({ ...formData, vehicleModel: txt })} style={tw`p-2 text-base ios:mb-2`} />
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

export default VehicalDetail;