import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
import Svg, { Path } from 'react-native-svg'
import { colors } from '../../utils/constant'
import { useNavigation } from '@react-navigation/native'
import { Avatar } from 'native-base'
import { useState } from 'react'
import { useEffect } from 'react'
import moment from 'moment/moment'
import { useDispatch, useSelector } from 'react-redux'
import { selectRide, selectRides, setRide } from '../../slices/travelSlice'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import { selectUserDetails } from '../../slices/userSlice'


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  { month: 'Jan', days: 31 },
  { month: 'Feb', days: 28 },
  { month: 'Mar', days: 31 },
  { month: 'Apr', days: 30 },
  { month: 'May', days: 31 },
  { month: 'Jun', days: 30 },
  { month: 'Jul', days: 31 },
  { month: 'Aug', days: 31 },
  { month: 'Sep', days: 30 },
  { month: 'Oct', days: 31 },
  { month: 'Nov', days: 30 },
  { month: 'Dec', days: 31 }
]
function MyRides() {
  const navigator = useNavigation();
  const today = new Date();
  const rides = useSelector(selectRides)
  const userInfo = useSelector(selectUserDetails)
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMoth] = useState(currentMonth);
  const [monthDetails, setMonthDetails] = useState();

  const isCurrentDay = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    selectedMonth == currentMonth &&
    currentYear === today.getFullYear();

  useEffect(() => {
    setMonthDetails({
      ...months[selectedMonth],
      monthNumber: selectedMonth,
      year: currentYear,
    })
  }, [selectedMonth])


  return (
    <Animated.View entering={SlideInRight} exiting={SlideInLeft} style={tw`flex-1`}>

      <View style={tw`flex-row items-center justify-between px-5 py-3 bg-white`}>
        <Text style={tw`text-gray-900 font-bold text-2xl`}>My Rides</Text>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigator.navigate("Wallet")} activeOpacity={0.9} style={tw`px-2 z-20 `}>
            <Image style={{ width: 36, height: 36 }} source={require("../../assets/images/wallet.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigator.navigate("Profile")} activeOpacity={0.9} style={tw`px-2 z-20 `}>
            <Avatar zIndex={20} bg="cyan.500" style={tw`border-4 border-gray-100`} alignSelf="center" size="md" source={{
              uri: userInfo?.profileImage || "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            }} />
          </TouchableOpacity>
        </View>
      </View>

      <>
        <Text style={tw`text-2xl font-medium text-center my-6`}>My Scheduled Rides</Text>

        <View style={tw`rounded-lg bg-white p-5 mx-auto`}>
          <View style={tw`flex-row items-center justify-between`}>
            {selectedMonth > 0 ?
              <TouchableOpacity onPress={() => setSelectedMoth(selectedMonth - 1)}>
                <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-8 h-8 text-gray-800`}>
                  <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </Svg>
              </TouchableOpacity> : <View style={tw`w-8 h-8`}></View>}

            <Text style={tw`text-lg font-medium flex-grow text-center`}>{monthDetails?.month} {monthDetails?.year}</Text>
            {selectedMonth < 12 ? <TouchableOpacity onPress={() => setSelectedMoth(selectedMonth + 1)}>
              <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-8 h-8 text-gray-800`}>
                <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </Svg>
            </TouchableOpacity> : <View style={tw`w-8 h-8`}></View>}
          </View>

          <View style={tw`flex-row items-center justify-start py-3 mx-auto w-[350px]`}>
            {daysOfWeek.map((day) => (
              <Text key={day} style={tw`text-base text-gray-500 w-[44px] mx-[3px] text-center`}>
                {day}
              </Text>
            ))}
          </View>
          <View style={tw`flex-row flex-wrap items-center justify-start mx-auto w-[350px]`}>
            {Array.from({ length: new Date(`01-${monthDetails?.month}-${monthDetails?.year}`).getDay() }, (_, i) => i + 1).map((day) => (
              <View key={day} style={[tw`w-[44px] h-[44px] m-[3px] rounded-xl flex-row justify-center items-center`]}></View>
            ))}
            {Array.from({ length: monthDetails?.days }, (_, i) => i + 1).map((day) => (<Day key={day} day={day} navigator={navigator} isCurrentDay={isCurrentDay(day)} month={monthDetails?.month} year={monthDetails?.year} disabled={moment(`${today.getDate() + "-" + months[today.getMonth()].month + "-" + today.getFullYear()}`).diff(moment(`${day}-${monthDetails?.month}-${monthDetails?.year}`), 'days') > 0} isSelected={''} rides={rides[`${moment(`${day}-${monthDetails?.month}-${monthDetails?.year}`).format('DD-MMM-YYYY')}`]} />))}
          </View>
        </View>
      </>
    </Animated.View>
  )
}

export default MyRides

const Day = ({ day, isCurrentDay, month, year, disabled, isSelected, navigator, rides }) => {
  const dispatch = useDispatch()
  const handlePress = (date) => {
    dispatch(setRide({
      date: date,
      rideList: rides
    }));
    navigator.navigate('OneDayRides', {
      date: date,
      rideList: rides
    })
  }
  return (
    <TouchableOpacity onPress={() => handlePress(`${moment(`${day}-${month}-${year}`).format('DD-MMM-YYYY')}`)} style={[tw`w-[44px] h-[44px] m-[3px] rounded-xl flex-row justify-center items-center`, isCurrentDay ? { backgroundColor: 'white', borderWidth: 1, borderColor: colors.blue } : disabled ? { backgroundColor: colors.light_grey } : isSelected ? { backgroundColor: colors.blue } : { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.light_grey }, (isSelected || rides?.length) && { backgroundColor: colors.blue }]}>
      <Text style={[tw`text-base text-center`, isCurrentDay ? { color: colors.blue } : isSelected ? { color: colors.white } : { color: colors.black }, (isSelected || rides?.length) && { color: colors.white }]}>
        {day}
      </Text>
    </TouchableOpacity>
  )
}
