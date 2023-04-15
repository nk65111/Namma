import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeIn, SlideInLeft } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import Svg, { Path } from 'react-native-svg'
import { PickImage } from '../../utils/constant'

function ProfilePic() {
    const navigation = useNavigation()
    const [imageUrl, setImageUrl] = useState('');

    const handleImageUpload = async (image) => {
        // upload image than move to next screen
        navigation.navigate('HomeScreen')

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
        <Animated.View exiting={SlideInLeft} entering={FadeIn} style={tw`flex-1 items-center justify-center relative`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <LinearGradient colors={['#007FFF', '#007FFF', '#0CAFFF', '#0CAFFF']} style={tw`flex-1 items-center h-full w-full relative`}>
                    <View style={tw`w-full`}>
                        <BackButton />

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
                                        <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-14 h-14`}>
                                            <Path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <Path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                        </Svg>
                                }
                            </>
                        </TouchableOpacity>
                        <View style={tw`flex-row items-center justify-between w-full pt-6`}>
                            <SecondaryButton disabled={!navigation.canGoBack()} text={'Back'} onPress={() => navigation.goBack()} />
                            <PrimaryButton text={"Continue"} onPress={() => navigation.navigate('HomeScreen')} />
                        </View>
                    </View>

                </LinearGradient>
            </TouchableWithoutFeedback>
        </Animated.View>
    )
}

export default ProfilePic

