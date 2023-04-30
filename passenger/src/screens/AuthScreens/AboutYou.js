import { useNavigation } from '@react-navigation/native'
import { Box, FormControl, Input, Stack } from 'native-base'
import React, { useState } from 'react'
import { Alert, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { PickImage, colors, uploadImage } from '../../utils/constant'
import { useUpdateProfile } from '../../hooks'
import { selectToken } from '../../slices/userSlice'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/EvilIcons'

function AboutYou() {
    const token = useSelector(selectToken)
    const navigation = useNavigation()
    const [imageUrl, setImageUrl] = useState('');

    const [formData, setFormData] = useState({
        name: 'Ankit'
    })

    const { isLoading, mutate: updateProfile } = useUpdateProfile(() => navigation.navigate('HomeScreen'));

    const handleImageUpload = async (image) => {

        const source = {
            uri: image.path,
            type: image.mime,
            name: 'kuchbhi',
        }
        let url = await uploadImage(source);
        updateProfile({ token, data: { image: url, name: formData.name } })
    }

    const handleImage = async () => {
        let Handler = await PickImage()
        console.log('handleImage -> Handler', Handler)
        if (Handler?.success) {
            setImageUrl(Handler?.response)
        } else {
            // console.log(Handler.response)
        }
    }
    const handleNext = async () => {
        if (formData?.name)
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
        else {

            Alert.alert('', 'Please fill all the details',
                [{ text: 'Ok' }, {}],
                {
                    cancelable: true,
                })
        }

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
                    {
                        isLoading ?
                            <>
                                <View style={tw`flex-1 items-center justify-center`}>
                                    <ActivityIndicator size={30} />
                                </View>
                            </>
                            :
                            <>
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

                                <View style={tw`w-full bg-white rounded-t-3xl flex-col`}>

                                    <TouchableOpacity onPress={() => handleImage()} style={tw`w-48 h-48 rounded-lg bg-gray-100 mx-auto my-6 flex-row items-center justify-center`}>
                                        <>
                                            {
                                                Boolean(imageUrl) ?
                                                    <Image source={{ uri: imageUrl?.path }} resizeMode="cover" style={tw`h-full w-full rounded-lg`} />
                                                    :
                                                    <Icon name='image' size={100} style={tw`text-gray-600`} />
                                            }
                                        </>
                                    </TouchableOpacity>
                                </View>

                                <View style={tw`flex-row items-center justify-between w-full pt-1`}>
                                    <SecondaryButton disabled={!navigation.canGoBack()} text={'Back'} onPress={() => navigation.goBack()} extra='my-6' />
                                    <PrimaryButton text={"Continue"} disabled={isLoading} onPress={handleNext} extra='my-6' />
                                </View>
                            </>}
                </View>

            </LinearGradient>
        </Animated.View>
    )
}

export default AboutYou