import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useReduxDevToolsExtension } from '@react-navigation/devtools'
import Splash from './screens/Splash'
import IntroScreen from './screens/IntroScreen'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './screens/AuthScreens/Login'
import OTPScreen from './screens/AuthScreens/OTPScreen'
import AboutYou from './screens/AuthScreens/AboutYou'
import ProfilePic from './screens/AuthScreens/ProfilePic'
import LiscencePic from './screens/AuthScreens/LiscencePic'

import RNLocation from 'react-native-location';
import { useDispatch } from 'react-redux'
import { setCurrentLocation, setRides } from './slices/travelSlice'
import { refetchLocation } from './utils/constant'
import NavigatorTab from './NavigatorTab'
import OneDayRides from './screens/Rides/OneDayRides'
import ScheduleRide from './screens/Rides/ScheduleRide'
import { ridesData } from './utils/routeData'
import { getLocation } from './hooks'

RNLocation.configure({
  distanceFilter: 1
});

function Routes() {
  const dispatch = useDispatch()

  const navigationRef = React.useRef()
  useReduxDevToolsExtension(navigationRef)
  const [jumpScreen, setJumpScreen] = React.useState('HomeScreen')
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    dispatch(setRides(ridesData))
  }, [])



  const permissionHandle = async () => {
    let location = ''
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse' // or 'fine'
      }
    });

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse",
          rationale: {
            title: "We need to access your location",
            message: "We use your location to show to find nearest match",
            buttonPositive: "OK",
            buttonNegative: "Cancel"
          }
        }
      })
      location = await RNLocation.getLatestLocation({ timeout: 10000 });
      setUserLocation(location);
    } else {
      location = await RNLocation.getLatestLocation({ timeout: 10000 })
      setUserLocation(location);
    }
    if (location) {
      dispatch(setCurrentLocation({ "description": "", "location": { "lat": location?.latitude, "lng": location?.longitude } }));
      let place = await getLocation({ lat: location?.latitude, long: location?.longitude });
      place = place.data?.results[0]?.formatted_address;
      console.log("place ", place)
      dispatch(setCurrentLocation({ "description": place || "", "location": { "lat": location?.latitude, "lng": location?.longitude } }))
    }
  }

  useEffect(() => { permissionHandle() }, [])

  useEffect(() => {
    if (typeof (userLocation) !== 'object') {
      permissionHandle();
    }
  }, [userLocation]);

  const TIME_MS = 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      refetchLocation(dispatch)
    }, TIME_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])


  // ! Auth Stack Navigator
  const AuthStackNavigator = createStackNavigator()
  const AuthStack = ({ routename }) => {
    console.log('ROUTE NAME ', routename)
    return (
      <AuthStackNavigator.Navigator screenOptions={{
        headerShown: false,
      }} initialRouteName={routename}>
        <>
          <AuthStackNavigator.Screen name="IntroScreen" component={IntroScreen} />
          <AuthStackNavigator.Screen name="Login" component={Login} />
          <AuthStackNavigator.Screen name="OTP" component={OTPScreen} />
          <AuthStackNavigator.Screen name="AboutYou" component={AboutYou} />
          <AuthStackNavigator.Screen name="ProfilePic" component={ProfilePic} />
          <AuthStackNavigator.Screen name="LiscencePic" component={LiscencePic} />
          <AuthStackNavigator.Screen name="HomeScreen" component={NavigatorTab} />
          <AuthStackNavigator.Group screenOptions={{
            presentation: 'modal',
            animation: 'slide_from_right'
          }}>
            <AuthStackNavigator.Screen name="Schedule" component={ScheduleRide} />
            <AuthStackNavigator.Screen name="OneDayRides" component={OneDayRides} />
          </AuthStackNavigator.Group>
        </>
      </AuthStackNavigator.Navigator>
    )
  }


  return !loading ? (
    <NavigationContainer>
      <AuthStack routename={jumpScreen} />
    </NavigationContainer>
  ) : (
    <Splash />
  )
}

export default Routes

// //remove devtools dependency in prod
