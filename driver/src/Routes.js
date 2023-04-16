import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useReduxDevToolsExtension } from '@react-navigation/devtools'
import Splash from './screens/Splash'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './screens/HomeScreens/Home'
import IntroScreen from './screens/IntroScreen'
import Svg, { Path } from 'react-native-svg'
import MyTabBar from './TabBar'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './screens/AuthScreens/Login'
import OTPScreen from './screens/AuthScreens/OTPScreen'
import AboutYou from './screens/AuthScreens/AboutYou'
import ProfilePic from './screens/AuthScreens/ProfilePic'
import LiscencePic from './screens/AuthScreens/LiscencePic'
import tw from 'twrnc'
import MyProfile from './screens/HomeScreens/MyProfile'
import ComingSoon from './screens/ComingSoon'
import ComingSoon2 from './screens/ComingSoon2'
import ComingSoon3 from './screens/ComingSoon3'

import RNLocation from 'react-native-location';
import { useDispatch } from 'react-redux'
import { setCurrentLocation } from './slices/travelSlice'
import { refetchLocation } from './utils/constant'
import NavigatorTab from './NavigatorTab'

RNLocation.configure({
  distanceFilter: 1
});

function Routes() {
  const dispatch = useDispatch()

  const navigationRef = React.useRef()
  useReduxDevToolsExtension(navigationRef)
  const [jumpScreen, setJumpScreen] = React.useState('IntroScreen')
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)


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
      setUserLocation(location );
    } else {
      location = await RNLocation.getLatestLocation({ timeout: 10000 })
      setUserLocation(location );
    }
    dispatch(setCurrentLocation(location))
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
          {/* <AuthStackNavigator.Group screenOptions={{
            presentation: 'modal',
            animation: 'slide_from_right'
          }}>
          </AuthStackNavigator.Group> */}
          <AuthStackNavigator.Screen name="IntroScreen" component={IntroScreen} />
          <AuthStackNavigator.Screen name="Login" component={Login} />
          <AuthStackNavigator.Screen name="OTP" component={OTPScreen} />
          <AuthStackNavigator.Screen name="AboutYou" component={AboutYou} />
          <AuthStackNavigator.Screen name="ProfilePic" component={ProfilePic} />
          <AuthStackNavigator.Screen name="LiscencePic" component={LiscencePic} />
          <AuthStackNavigator.Screen name="HomeScreen" component={NavigatorTab} />
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
