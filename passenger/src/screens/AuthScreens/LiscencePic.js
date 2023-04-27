import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { PickImage, colors } from '../../utils/constant'
import Icon from 'react-native-vector-icons/EvilIcons'
import { useUpdateProfile } from '../../hooks'
import { useSelector } from 'react-redux'
import { selectToken } from '../../slices/userSlice'

function ProfilePic({ navigation }) {
    const token = useSelector(selectToken)
    const navigator = useNavigation()
    const [imageUrl, setImageUrl] = useState('');

    const { isLoading, mutate: updateProfile } = useUpdateProfile(() => navigation.push('HomeScreen'));

    const handleImageUpload = async (image) => {
        updateProfile({ token, data: { liscencePic: image } })
    }

    const handleImage = async (Location) => {
        let Handler = await PickImage(Location)
        console.log('handleImage -> Handler', Handler)
        if (Handler?.success) {
            setImageUrl(Handler?.response)
        } else {
            // console.log(Handler.response)
        }
    }
    const handleNext = async () => {
        handleImageUpload();
        if (!imageUrl) {
            Alert.alert('Please Upload Image')
        } else {
            Alert.alert(
                '',
                "Kindly ensure it's your actual picture preferably a formal one, for better curation.",

                [{ text: 'Next', onPress: () => handleImageUpload(imageUrl) }, { text: 'Cancel' }],
                {
                    cancelable: true,
                }
            )
        }
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
                                Boolean(imageUrl) ?
                                    <Image source={{ uri: imageUrl }} resizeMode="cover" style={tw`h-full w-full rounded-lg`} />
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

