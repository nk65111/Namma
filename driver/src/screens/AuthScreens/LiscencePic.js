import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc';
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { PickImage, colors } from '../../utils/constant'
import Icon from 'react-native-vector-icons/EvilIcons'
import { DriverKycService } from '../../services';
import { SetLocalStorage } from '../../helpers/FunctionHelper';

const ProfilePic = ({ navigation }) => {
    const navigator = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState('');

    const handleImage = async (Location) => {
        let Handler = await PickImage(Location)
        if (Handler?.success) {
            setImage(Handler?.response)
        }
    }

    const handleNext = async () => {
        if (!image) {
            Alert.alert('Please Upload Image')
        } else {
            Alert.alert(
                '',
                "Kindly ensure it's your actual picture preferably a formal one, for better curation.",
                [{ text: 'Next', onPress: () => uploadLicence(image) }, { text: 'Cancel' }],
                {
                    cancelable: true,
                }
            )
        }
    }

    const uploadLicence = (image) => {
        setIsLoading(true);
        let formData = new FormData();
        formData.append("drivingLicenceImage", image);
        DriverKycService.uploadProfilePic(image)
            .then((data) => {
                SetLocalStorage('DRIVER_DATA', JSON.stringify(data));
                navigator.navigate('BANK_DETAIL');
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <Animated.View exiting={SlideInLeft} entering={SlideInRight} style={tw`flex-1 items-center justify-center relative`}>
            <LinearGradient colors={colors.gradient_blue} style={tw`flex-1 items-center h-full w-full relative`}>
                <View style={tw`w-full`}>
                    <BackButton extra={'m-3 ml-5'} />

                    <View style={tw`mt-20 mb-6`}>
                        <Text style={tw`text-white text-3xl font-semibold text-center`}>Liscence Image</Text>
                    </View>
                </View>

                <View style={tw`w-full bg-white rounded-t-3xl p-10 h-full flex-col`}>

                    <TouchableOpacity onPress={() => handleImage('Liscence')} style={tw`w-80 h-48 rounded-lg bg-gray-100 mx-auto my-6 flex-row items-center justify-center`}>
                        <>
                            {
                                Boolean(image) ?
                                    <Image source={{ uri: image }} resizeMode="cover" style={tw`h-full w-full rounded-lg`} />
                                    :
                                    <Icon name='image' size={100} style={tw`text-gray-600`} />
                            }
                        </>
                    </TouchableOpacity>
                    <View style={tw`flex-row items-center justify-between w-full pt-6`}>
                        <SecondaryButton disabled={!navigator.canGoBack()} text={'Back'} onPress={() => navigator.goBack()} extra='my-6' />
                        <PrimaryButton text={"Continue"} disabled={isLoading} onPress={handleNext} extra=' my-6' />
                    </View>
                </View>

            </LinearGradient>
        </Animated.View>
    )
}

export default ProfilePic

