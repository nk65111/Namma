import React from 'react'
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
import Svg, { Path } from 'react-native-svg'
import { colors } from '../../utils/constant'
import { useNavigation } from '@react-navigation/native'
import { Avatar } from 'native-base'
import { useState } from 'react'
import { useEffect } from 'react'
import PrimaryButton from '../../components/PrimaryButton'
import moment from 'moment/moment'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAP_API_KEY } from '../../services/config'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { setRides as NewRides } from '../../slices/travelSlice'
import BackButton from '../../components/BackButton'
import { getRides, getToken } from '../../services/service'
import { useAddRide, useUpdateRide } from '../../hooks'
import { selectToken, selectUserDetails } from '../../slices/userSlice'
import { useQuery } from 'react-query'


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
function ScheduleRide({ route }) {
  let ride = route?.params?.ride
  const userInfo = useSelector(selectUserDetails)
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  const [initialStartName, setInitialStartName] = useState(ride?.pickUpLocation?.name || '')
  const [initialEndName, setInitialEndName] = useState(ride?.dropLocation?.name || '')
  const [step, setStep] = useState(ride || 1)
  const navigator = useNavigation();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMoth] = useState(currentMonth);
  const [monthDetails, setMonthDetails] = useState();
  const [rides, setRides] = useState([]);
  const [end, setEnd] = useState(ride ? { description: ride?.pickUpLocation?.name || '', location: { "lat": ride?.pickUpLocation?.lat, "lng": ride?.pickUpLocation?.lng } } : null)
  const [start, setStart] = useState(ride ? { description: ride?.dropLocation?.name || '', location: { "lat": ride?.dropLocation?.lat, "lng": ride?.dropLocation?.lng } } : null)
  const [pickUp, setPickUp] = useState(ride?.pickUpTime || null);
  const [loading, setLoading] = useState(false)


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
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (data) => {
    setPickUp(new Date(data).toString())
    hideDatePicker();
  };

  const { refetch: fetchRides } = useQuery('userRides', () => getRides(token), {
    enabled: false,
    staleTime: 300000,
    onSuccess: (res) => {
      if (res.data?.rides) {
        dispatch(NewRides(res.data || {}))
      }
    }
  })

  const { isLoading: adding, mutate: addRide } = useAddRide(() => { fetchRides(); route.params?.from == 'addRide' ? navigator.navigate('Add Ride') : navigator.goBack() })
  const { isLoading: updating, mutate: updateRide } = useUpdateRide(() => { fetchRides(); navigator.goBack() })

  const handleRides = async () => {
    let token = await getToken();
    let data = {
      "dropLatitude": end?.location?.lat,
      "dropLongitute": end?.location?.lng,
      "metadata": `${JSON.stringify({
        pickUpLocation: { ...start.location, name: start.description },
        dropLocation: { ...end.location, name: end.description }
      })}`,
      "pickUpLatitiude": start?.location?.lat,
      "pickUpLongitute": start?.location?.lng,
      "pickUpTime": moment(pickUp).format("HH:mm:ss")
    }
    if (ride) {
      data.id = ride.id;
      data.date = ride.pickUpDate;

      updateRide({ token, data })
    }
    else {
      data.date = rides;
      addRide({ token, data })
    }
  }

  const confirmRide = () => {
    Alert.alert("Ride Confirmation", 'after confirmation, you can edit your rides in My Rides!', [
      {
        text: 'Back',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Ok', onPress: () => handleRides() },
    ])
  }

  return (
    <Animated.View entering={FadeInUp} exiting={FadeInDown} style={tw`flex-1`}>

      <View style={tw`flex-row items-center justify-between px-5 py-3 bg-white`}>
        <View style={tw`flex-row items-center`}>
          <BackButton />
          <Text style={tw`text-gray-900 font-bold text-2xl`}>Schedule Ride</Text>
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

      {
        adding || updating ?
          <>
            <View style={tw`flex-1 items-center justify-center`}>
              <ActivityIndicator size={30} />
            </View>
          </>
          :
          <>
            {
              step == 1 ?
                <>

                  <Text style={tw`text-2xl font-medium text-center my-6`}>Select Dates</Text>

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
                      {Array.from({ length: monthDetails?.days }, (_, i) => i + 1).map((day) => (<Day key={day} day={day} isCurrentDay={isCurrentDay(day)} month={monthDetails?.month} year={monthDetails?.year} disabled={moment(`${today.getDate() + "-" + months[today.getMonth()].month + "-" + today.getFullYear()}`).diff(moment(`${day}-${monthDetails?.month}-${monthDetails?.year}`), 'days') > 0} rides={rides} setRides={setRides} isSelected={rides.findIndex(item => moment(item).diff(moment(`${day}-${monthDetails?.month}-${monthDetails?.year}`), 'days') == 0) > -1} />))}
                    </View>
                  </View>

                  <PrimaryButton onPress={() => setStep(2)} disabled={!rides.length} text={'Continue'} extra='my-4 min-w-[300px] mx-auto' />
                </>
                :
                <View style={tw`flex-1 flex-col px-5`}>
                  <View style={tw``}>
                    <View style={tw``}>
                      <Text style={tw`text-lg font-medium my-2`}>Pick Up Location</Text>
                      <GooglePlacesAutocomplete
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={400}
                        placeholder="Pickup location by Place"
                        enablePoweredByContainer={false}
                        minLength={2}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                          setLoading(true)
                          setInitialStartName(data?.description)
                          setStart({
                            location: details?.geometry.location,
                            description: data?.description,
                          });
                          setLoading(false)
                        }}
                        query={{
                          key: GOOGLE_MAP_API_KEY,
                          language: 'en',
                          components: 'country:in'
                        }}
                        style={tw`text-base text-black`}
                        textInputProps={{
                          value: initialStartName || ride?.pickUpLocation?.name,
                          onChangeText: (text) => setInitialStartName(text),
                          style: {
                            flex: 1,
                            paddingLeft: 20,
                            borderWidth: 1,
                            borderColor: '#999',
                            borderRadius: 10
                          }
                        }}
                        styles={{
                          container: {
                            flex: 0,
                            backgroundColor: 'white',
                          },
                          listView: {
                            position: 'absolute'
                          }
                        }}
                        renderRow={(rowData) => {
                          return (
                            <View style={tw`relative`}>
                              <TouchableOpacity style={tw`w-full h-full absolute top-0 left-0`}>
                              </TouchableOpacity>
                              <Text style={tw`text-gray-800`}>{rowData?.description}</Text>
                            </View>
                          )
                        }}
                      />
                    </View>
                    <View style={tw``}>
                      <Text style={tw`text-lg font-medium my-2`}>Drop Location</Text>
                      <GooglePlacesAutocomplete
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={400}
                        placeholder="Drop location by Place"
                        enablePoweredByContainer={false}
                        minLength={2}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                          setLoading(true)
                          setInitialEndName(data?.description);
                          setEnd({
                            location: details?.geometry.location,
                            description: data?.description,
                          });
                          setLoading(false)
                        }}
                        query={{
                          key: GOOGLE_MAP_API_KEY,
                          language: "en",
                          components: 'country:in'
                        }}
                        style={tw`text-base text-black`}
                        textInputProps={{
                          value: initialEndName || ride?.dropLocation?.name,
                          onChangeText: (text) => setInitialEndName(text),
                          style: {
                            flex: 1,
                            paddingLeft: 20,
                            borderWidth: 1,
                            borderColor: '#999',
                            borderRadius: 10
                          }
                        }}
                        styles={{
                          container: {
                            flex: 0,
                            backgroundColor: 'white',
                          },
                          listView: {
                            position: 'absolute'
                          }
                        }}
                        renderRow={(rowData) => {
                          return (
                            <View style={tw`relative`}>
                              <TouchableOpacity style={tw`w-full h-full absolute top-0 left-0`}>
                              </TouchableOpacity>
                              <Text style={tw`text-gray-800`}>{rowData?.description}</Text>
                            </View>
                          )
                        }}
                      />
                    </View>

                    <View style={tw`py-6`}>
                      <TouchableOpacity style={tw`px-4 py-2 bg-blue-500 rounded-lg`} onPress={() => setDatePickerVisibility(true)}>
                        <Text style={tw`text-lg font-medium text-white text-center`}>{pickUp ? `${moment(pickUp)?.format('LT')} - ${moment(pickUp).add(30, 'minute')?.format('LT')}` : 'Pickup Time'}</Text>
                      </TouchableOpacity>
                    </View>

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="time"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                  </View>
                  <PrimaryButton onPress={confirmRide} text={ride ? "Update Ride" : "Confirm Ride"} disabled={!start || !end || !pickUp || adding || updating || loading} extra='mb-6 mt-20 ' />
                </View>
            }
          </>
      }

    </Animated.View>
  )
}

export default ScheduleRide

const Day = ({ day, isCurrentDay, month, year, disabled, rides, setRides, isSelected }) => {

  const handlePress = (date) => {
    let arr = [...rides]
    let i = arr.findIndex(item => moment(date).diff(moment(item), 'days') == 0);
    if (i > -1) {
      arr.splice(i, 1);
      setRides(arr)
    }
    else {
      setRides([...rides, date]);
    }
  }
  return (
    <TouchableOpacity disabled={disabled} onPress={() => handlePress(moment(`${day}-${month}-${year}`))} style={[tw`w-[44px] h-[44px] m-[3px] rounded-xl flex-row justify-center items-center`, isCurrentDay ? { backgroundColor: 'white', borderWidth: 1, borderColor: colors.blue } : disabled ? { backgroundColor: colors.light_grey } : isSelected ? { backgroundColor: colors.blue } : { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.light_grey }, isSelected && { backgroundColor: colors.blue }]}>
      <Text style={[tw`text-base text-center`, isCurrentDay ? { color: colors.blue } : isSelected ? { color: colors.white } : { color: colors.black }, isSelected && { color: colors.white }]}>
        {day}
      </Text>
    </TouchableOpacity>
  )
}
