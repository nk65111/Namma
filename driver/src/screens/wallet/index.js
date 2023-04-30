import { Avatar, Text } from 'native-base'
import React from 'react'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import BackButton from '../../components/BackButton'
import { Image, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../../utils/constant'
import { useNavigation } from '@react-navigation/native';

const Wallet = () => {
    const navigator = useNavigation();
    const userInfo = {}

    return (
        <Animated.View entering={FadeInUp} exiting={FadeInDown} style={tw`flex-1`}>

            <View style={tw`flex-row items-center justify-between px-5 py-3 bg-white`}>
                <View style={tw`flex-row items-center`}>
                    <BackButton />
                    <Text style={tw`text-gray-900 font-bold text-2xl`}>Wallet</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={() => navigator.navigate("Wallet")} activeOpacity={0.9} style={tw`px-2 z-20 `}>
                        <Image style={{ width: 32, height: 32 }} source={require("../../assets/images/wallet.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigator.navigate("Profile")} activeOpacity={0.9} style={tw`px-2 z-20 `}>
                        <Avatar zIndex={20} bg="cyan.500" style={tw`border-4 border-gray-100`} alignSelf="center" size="md" source={{
                            uri: userInfo?.profileImage || "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                        }} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={tw`p-5`}>
                <LinearGradient colors={colors.gradient_blue} style={tw`rounded-lg w-full h-40 p-5 flex-row items-center justify-between`}>
                    <View style={tw``}>
                        <Text style={tw`text-2xl text-right font-semibold text-white`}>With <Text style={tw`text-yellow-300`}>AutoPay</Text></Text>
                        <Text style={tw`text-2xl text-right font-semibold text-white`}>No more Recharge</Text>
                        <Text style={tw`text-2xl text-right font-semibold text-white`}>Gentle Reminder</Text>
                    </View>
                    <View>
                        <Image style={{ width: 100, height: 100 }} source={require("../../assets/images/schedule.png")} />
                    </View>
                </LinearGradient>

                <View style={tw`py-4 px-10 bg-white rounded-lg shadow-lg shadow-gray-100 my-6 mx-auto`}>
                    <Text style={tw`text-3xl font-medium text-gray-800`}>Rs. {Math.round(Math.random() * 500)}</Text>
                </View>

                <View style={tw`flex-row items-center justify-around py-4`}>
                    <TouchableOpacity style={tw`py-3 px-6 rounded-lg shadow bg-rose-600`}>
                        <Text style={tw`text-xl font-medium text-white`}>Add More</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`py-3 px-6 rounded-lg shadow bg-teal-600`}>
                        <Text style={tw`text-xl font-medium text-white`}>Withdraw</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={tw`rounded-full overflow-hidden bg-white shadow-lg shadow-gray-100 py-2 mt-4`}>
                        <Image style={{ width: 400, height: 50, resizeMode: 'contain', }} source={require("../../assets/images/GooglePay.png")} />
                    </View>
                    <View style={tw`rounded-full overflow-hidden bg-white shadow-lg shadow-gray-100 py-2 mt-6`}>
                        <Image style={{ width: 400, height: 50, resizeMode: 'contain' }} source={require("../../assets/images/PhonePe.png")} />
                    </View>
                </View>
            </View>
        </Animated.View>
    )
}

export default Wallet