import { useNavigation } from '@react-navigation/native'
import { Box, FormControl, Input, Stack } from 'native-base'
import React from 'react'
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeIn } from 'react-native-reanimated'
import tw from 'twrnc'
import BackButton from '../../components/BackButton'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

function AboutYou() {
    const navigation = useNavigation()
    return (
        <Animated.View entering={FadeIn} style={tw`flex-1 items-center justify-center relative`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <LinearGradient colors={['#007FFF', '#007FFF', '#0CAFFF', '#0CAFFF']} style={tw`flex-1 items-center h-full w-full relative`}>
                    <View style={tw`w-full`}>
                        <BackButton />

                        <View style={tw`mt-20 mb-6`}>
                            <Text style={tw`text-white text-3xl font-semibold text-center`}>Complete Your Profile</Text>
                        </View>
                    </View>

                    <View style={tw`w-full bg-white rounded-t-3xl p-10 h-full flex-col min-h-[420px]`}>
                        <Box w="100%" maxWidth="300px" style={tw`mb-4`}>
                            <FormControl isRequired>
                                <Stack mx="4">
                                    <FormControl.Label>Your Name</FormControl.Label>
                                    <Input placeholder="Name" style={tw`p-2 text-base ios:mb-2`} />
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
                                    <Input placeholder="DL14 20110012345" style={tw`p-2 text-base ios:mb-2`} />
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
                                    <Input placeholder="TN 75 AA 7106" style={tw`p-2 text-base ios:mb-2`} />
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
                                    <Input placeholder="Honda Civic " style={tw`p-2 text-base ios:mb-2`} />
                                    <FormControl.ErrorMessage>
                                        Invalid Format
                                    </FormControl.ErrorMessage>
                                </Stack>
                            </FormControl>
                        </Box>

                        <View style={tw`flex-row items-center justify-between w-full pt-1`}>
                            <SecondaryButton disabled={!navigation.canGoBack()} text={'Back'} onPress={() => navigation.goBack()} />
                            <PrimaryButton text={"Continue"} onPress={() => navigation.navigate('ProfilePic')} />
                        </View>
                    </View>

                </LinearGradient>
            </TouchableWithoutFeedback>
        </Animated.View>
    )
}

export default AboutYou