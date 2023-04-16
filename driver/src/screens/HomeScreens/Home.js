import { Avatar, Icon, Input } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import tw from 'twrnc'
import { useDispatch, useSelector } from 'react-redux'
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { setOrigin, setDestination } from '../../slices/travelSlice'
import { GOOGLE_MAP_API_KEY } from '../../services/config'
import Map from '../../components/Map'
import MapView from 'react-native-maps'
import { selectCurrentLocation, selectDestination, selectOrigin, setDestination, setOrigin } from '../../slices/travelSlice'



const Search = ({ style }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-7 h-7 ${style}`}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </Svg>
)


function Home() {
  const dispatch = useDispatch();
  const currentLocation = useSelector(selectCurrentLocation);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination)


  return (
    <Animated.View entering={FadeIn.duration(500)} style={tw`flex-1 bg-white`}>

      <Animated.View entering={SlideInUp.duration(500)} style={tw`pt-4 flex-row items-center justify-between relative z-10`}>
        <View style={tw`flex-1 absolute top-4 left-0 z-10 px-2`}>
          <GooglePlacesAutocomplete
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            placeholder="Search Destination by Place"
            enablePoweredByContainer={false}
            minLength={2}
            fetchDetails={true}
            onPress={(data, details = null) => {
              // dispatch(
              //   setOrigin({
              //     location: details?.geometry.location,
              //     description: data?.description,
              //   })
              // );
              dispatch(setDestination({
                location: details?.geometry.location,
                description: data?.description,
              }));
            }}
            query={{
              key: GOOGLE_MAP_API_KEY,
              language: "en",
            }}
            style={tw`text-base text-black`}
            textInputProps={{
              style: {
                flex: 1,
                paddingLeft: 20
              }
            }}
            styles={{
              container: {
                flex: 1,
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

        <View style={tw`flex-1 h-12`}></View>
        <TouchableOpacity activeOpacity={0.9} style={tw`bg-white px-4`}>
          <Avatar zIndex={20} bg="cyan.500" style={tw`border-4 border-gray-100`} alignSelf="center" size="md" source={{
            uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          }} />
        </TouchableOpacity>

      </Animated.View>
      <View style={tw`px-4 py-2 bg-blue-50`}>
        <Text>Destination : </Text>
        <Text>{destination?.location?.lat} , {destination?.location?.lng}</Text>
        <Text style={tw`mt-2`}>My Location :</Text>
        <Text>{currentLocation?.latitude} , {currentLocation?.longitude}</Text>
      </View>
      <View style={tw`flex-1 items-center justify-start bg-blue-50`}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation?.latitude || 27.594594594594593,
            longitude: currentLocation?.longitude || 78.01532460294433,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        {/* <Image
          style={{ width: 360, height: 300 }}
          source={require('../../assets/images/ComingSoon.gif')}
        /> */}
        <Map />
      </View>
    </Animated.View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});