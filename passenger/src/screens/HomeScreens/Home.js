import { Avatar } from 'native-base'
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import tw from 'twrnc'
import { useDispatch, useSelector } from 'react-redux'
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAP_API_KEY } from '../../services/config'
import Map from '../../components/Map'
import { selectCurrentLocation, selectTravelTimeInfo, setDestination } from '../../slices/travelSlice'
import { selectUserDetails } from '../../slices/userSlice'
import { useNavigation } from '@react-navigation/native'

const Search = ({ style }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-7 h-7 ${style}`}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </Svg>
)


function Home() {
  const navigator = useNavigation()
  const dispatch = useDispatch();
  const currentLoc = useSelector(selectCurrentLocation)
  const travelInfo = useSelector(selectTravelTimeInfo);
  const userInfo = useSelector(selectUserDetails)

  return (
    <Animated.View entering={FadeIn.duration(500)} style={tw`flex-1`}>
      <Animated.View entering={SlideInUp.duration(500)} style={[tw`p-4 pt-6 relative z-10 flex-row items-start justify-between w-full bg-white h-52`, { borderBottomRightRadius: 55 }]}>
        <Text style={tw`text-3xl font-medium pl-4`}>Hi, {userInfo?.name || 'Topi Kumar'}</Text>

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

        <View style={[tw`py-2 flex-col items-center z-10 w-10`, {
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
        }]}>
          <View style={tw`w-2 h-2 rounded-full bg-gray-800`}></View>
          <View style={tw`w-0.5 h-9 my-1 bg-gray-400`}></View>
          <View style={tw`w-2 h-2 rounded-full bg-gray-800`}></View>
        </View>

        <Text numberOfLines={1} style={[tw`py-3 px-5`, {
          flex: 1,
          backgroundColor: '#fff',
          position: 'absolute',
          width: Dimensions.get('window').width - 60,
          top: 85,
          left: 30,
          right: 0,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#eee'
        }]} >{currentLoc?.description || 'Getting your location...'}</Text>
        <GooglePlacesAutocomplete
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          placeholder="Search Destination by Place"
          enablePoweredByContainer={false}
          minLength={2}
          fetchDetails={true}
          onPress={(data, details = null) => {
            dispatch(setDestination({
              location: details?.geometry.location,
              description: data?.description,
            }));
          }}
          query={{
            key: GOOGLE_MAP_API_KEY,
            language: "en",
            components: 'country:in'
          }}
          style={tw`text-base text-black`}
          textInputProps={{
            style: {
              flex: 1,
              paddingLeft: 20,
              paddingRight: 20
            }
          }}
          styles={{
            container: {
              flex: 1,
              backgroundColor: '#fff',
              position: 'absolute',
              width: Dimensions.get('window').width - 60,
              top: 140,
              left: 30,
              right: 0,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#eee'
            },
            listView: {
              position: 'absolute',
              width: Dimensions.get('window').width,
              left: 0,
              height: 500
            }
          }}
          renderRow={(rowData) => {
            return (
              <View style={tw`relative`}>
                <TouchableOpacity style={tw`w-full h-full absolute top-0 left-0`}>
                </TouchableOpacity>
                <Text style={tw`text-gray-800 px-2`}>{rowData?.description}</Text>
              </View>
            )
          }}
        />

      </Animated.View>

      {
        travelInfo ?
          <View style={tw`px-4 py-4 bg-blue-50`}>
            <Text style={tw`text-base`}>Expected Travel Time: {travelInfo?.duration?.text}</Text>
            <Text style={tw`mt-2 text-base`}>Expected Travel Distance: {travelInfo?.distance?.text}</Text>
          </View>
          :
          <></>
      }
      <View style={tw`flex-1 items-center justify-start`}>
        {currentLoc && <Map />}
      </View>
    </Animated.View>
  )
}

export default Home
