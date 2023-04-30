import React from 'react'
import { Text, View, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native'
import tw from 'twrnc'
import moment from 'moment'
import { useState } from 'react'
import { Avatar } from 'native-base'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Animated, { FadeInUp } from 'react-native-reanimated'
import BlueButton from '../../components/BlueButton'
import PrimaryButton from '../../components/PrimaryButton'
import BackButton from '../../components/BackButton'
import { useCancelRide } from '../../hooks'
import { getRides, getToken } from '../../services/service'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { selectRide, setRide, setRides } from '../../slices/travelSlice'
import { useQuery } from 'react-query'
import { selectToken, selectUserDetails } from '../../slices/userSlice'

function OneDayRides() {
  const dispatch = useDispatch()
  const userInfo = useSelector(selectUserDetails)
  const navigator = useNavigation()
  const ride = useSelector(selectRide)
  const token = useSelector(selectToken);

  const removeRide = (id) => {
    let arr = [...ride?.rideList]
    let idx = arr.findIndex(item => item.id == id);
    if (idx > -1) {
      arr.splice(idx, 1);
      console.log('ride removed');
      dispatch(setRide({
        date: ride?.date,
        rideList: arr
      }))
    }
  }

  return (
    <Animated.View style={tw`flex-1`}>
      <View style={tw`flex-row items-center justify-between px-5 py-3 bg-white`}>
        <View style={tw`flex-row items-center`}>
          <BackButton />
          <Text style={tw`text-gray-900 font-bold text-2xl ml-2`}>My Rides</Text>
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
      <View style={tw`bg-white py-2 px-5 shadow-lg rounded-xl mx-auto my-4`}>
        <Text style={tw`text-2xl text-center font-medium`}>{moment(ride?.date).format("DD MMM YYYY")}</Text>
      </View>

      <ScrollView horizontal={false} style={tw`flex-1 w-full p-5`} showsVerticalScrollIndicator={false}>
        {
          ride?.rideList?.length ?
            ride?.rideList?.map((ride, i) => <RideInfo removeRide={removeRide} dispatch={dispatch} token={token} key={i} navigator={navigator} ride={ride} />)
            :
            <Text style={tw`text-3xl font-medium text-gray-400 text-center`}>No Ride Scheduled</Text>
        }
      </ScrollView>
    </Animated.View>
  )
}

export default OneDayRides

const RideInfo = ({ removeRide, dispatch, ride, navigator, token }) => {
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    navigator.navigate("Schedule", { ride: ride })
  }

  const { isLoading, refetch: fetchRides } = useQuery('userRides', () => getRides(token), {
    enabled: false,
    staleTime: 300000,
    onSuccess: (res) => {
      removeRide(ride.id);
      if (res.data?.rides) {
        dispatch(setRides(res.data || {}));
      }
    }
  })

  const { isLoading: canceling, mutate: cancelRide } = useCancelRide(() => fetchRides())

  const handleCancel = async () => {
    let token = await getToken();
    Alert.alert("Cancel Ride", 'Are you sure, you want to cancel ride?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => cancelRide({ token, rideId: ride.id }) },
    ])
  }

  if (canceling || isLoading) return (<>
    <View style={tw`flex-row items-center justify-center h-40`}>
      <ActivityIndicator size={30} />
    </View>
  </>)

  return (
    <>
      <Animated.View entering={FadeInUp} style={tw`py-2 px-4 shadow-lg bg-white rounded-lg mb-4`}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setOpen(!open)} style={tw`flex-row items-start justify-between`}>
          <View style={tw`py-2 flex-col items-center`}>
            <View style={tw`w-2 h-2 rounded-full bg-gray-800`}></View>
            <View style={tw`w-0.5 h-4 my-1 bg-gray-400`}></View>
            <View style={tw`w-2 h-2 rounded-full bg-gray-800`}></View>
          </View>
          <View style={tw`flex-grow px-2 pr-8`}>
            <Text numberOfLines={1} style={tw`text-lg`}>{ride.pickUpLocation?.name}</Text>
            <Text numberOfLines={1} style={tw`text-lg`}>{ride.dropLocation?.name}</Text>
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
            <Text style={tw`text-lg font-medium`}>PickUp Time:  </Text>
            <Text style={tw`text-lg`}>{`${moment(ride?.pickUpTime)?.format('LT')} - ${moment(ride?.pickUpTime).add(30, 'minute')?.format('LT')}`}</Text>
          </View>
          <View style={tw`flex-row items-center my-2`}>
            <Text style={tw`text-lg font-medium`}>Travel Distance: </Text>
            <Text style={tw`text-lg`}>{ride?.travelDistance}</Text>
          </View>
          <View style={tw`flex-row items-center my-2`}>
            <Text style={tw`text-lg font-medium`}>Travel Time: </Text>
            <Text style={tw`text-lg`}>{ride?.travelTime}</Text>
          </View>
          <View style={tw`flex-row items-center justify-between my-4`}>
            <BlueButton text={'Edit Ride'} onPress={handleEdit} disabled={moment(ride?.pickUpDate).diff(moment(), 'hours') < 24 || canceling} />
            <PrimaryButton text={"Cancel"} onPress={handleCancel} disabled={moment(ride?.pickUpDate).diff(moment(), 'hours') < 2 || canceling} />
          </View>
        </View>
      </Animated.View>
    </>
  )
}

