import { Avatar } from 'native-base'
import React from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInUp, SlideInLeft, SlideInRight } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import tw from 'twrnc'
import { selectUpcomingRide } from '../../slices/travelSlice'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import moment from 'moment'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import BlueButton from '../../components/BlueButton'
import PrimaryButton from '../../components/PrimaryButton'
import { selectUserDetails } from '../../slices/userSlice'

function AddRide() {
    const navigator = useNavigation()
    const userInfo = useSelector(selectUserDetails)
    const upcomingRide = useSelector(selectUpcomingRide)
    const [open, setOpen] = useState(false);

    const addRide = () => {
        navigator.navigate("Schedule", { from: 'addRide' })
    }

    const handleEdit = () => {
        navigator.navigate("Schedule", { ride: upcomingRide })
    }

    const handleCancel = () => {
        Alert.alert("Cancel Ride", 'Are you sure, you want to cancel ride?', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => console.log('OK Pressed') },
        ])
    }

    return (
        <Animated.View entering={SlideInRight} exiting={SlideInLeft} style={tw`flex-1`}>

            <View style={tw`flex-row items-center justify-between px-5 py-3 bg-white`}>
                <Text style={tw`text-gray-900 font-bold text-2xl`}>My Rides</Text>
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

            <View style={tw`px-5`}>
                <Text style={tw`text-2xl font-medium text-center my-6`}>Upcoming Ride</Text>

                {upcomingRide ? <Animated.View entering={FadeInUp} style={tw`py-2 px-4 shadow-lg bg-white rounded-lg mb-4`}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => setOpen(!open)} style={tw`flex-row items-start justify-between`}>
                        <View style={tw`py-2 flex-col items-center`}>
                            <View style={tw`w-2 h-2 rounded-full bg-gray-800`}></View>
                            <View style={tw`w-0.5 h-4 my-1 bg-gray-400`}></View>
                            <View style={tw`w-2 h-2 rounded-full bg-gray-800`}></View>
                        </View>
                        <View style={tw`flex-grow px-2 pr-8`}>
                            <Text numberOfLines={1} style={tw`text-lg`}>{upcomingRide.pickUpLocation?.name}</Text>
                            <Text numberOfLines={1} style={tw`text-lg`}>{upcomingRide.dropLocation?.name}</Text>
                        </View>
                        <View style={tw`absolute top-1 right-0`}>
                            {
                                open ?
                                    <Icon name='arrow-up' size={20} />
                                    :
                                    <Icon name='arrow-down' size={20} />
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={tw`${open ? '' : 'hidden'}`}>
                        <View style={tw`flex-row items-center my-2`}>
                            <Text style={tw`text-lg font-medium`}>PickUp Date:  </Text>
                            <Text style={tw`text-lg`}>{moment(upcomingRide?.pickUpDate)?.format('DD MMM YYYY')}</Text>
                        </View>
                        <View style={tw`flex-row items-center my-2`}>
                            <Text style={tw`text-lg font-medium`}>PickUp Time:  </Text>
                            <Text style={tw`text-lg`}>{`${moment(upcomingRide?.pickUpTime)?.format('LT')} - ${moment(upcomingRide?.pickUpTime).add(30, 'minute')?.format('LT')}`}</Text>
                        </View>
                        <View style={tw`flex-row items-center my-2`}>
                            <Text style={tw`text-lg font-medium`}>Travel Distance: </Text>
                            <Text style={tw`text-lg`}>{upcomingRide?.travelDistance}</Text>
                        </View>
                        <View style={tw`flex-row items-center my-2`}>
                            <Text style={tw`text-lg font-medium`}>Travel Time: </Text>
                            <Text style={tw`text-lg`}>{upcomingRide?.travelTime}</Text>
                        </View>
                        {/* <View style={tw`flex-row items-center justify-between my-4`}>
                            <BlueButton text={'Edit Ride'} onPress={handleEdit} />
                            <PrimaryButton text={"Cancel"} onPress={handleCancel} />
                        </View> */}
                    </View>
                </Animated.View>
                    :
                    <Text style={tw`text-3xl font-medium text-gray-400 text-center`}>No Ride Scheduled</Text>
                }

                <PrimaryButton text={'+ Schedule Rides'} onPress={addRide} extra='mt-10 mx-auto' />
            </View>
        </Animated.View >
    )
}

export default AddRide