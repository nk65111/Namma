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

RNLocation.configure({
  distanceFilter: 1
});

const CollectionIcon = ({ focus }) => <Svg xmlns="http://www.w3.org/2000/svg" style={tw`w-7 h-7 ${focus ? 'text-rose-600' : 'text-gray-300'} mx-auto`} viewBox="0 0 20 20" fill="currentColor">
  <Path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
</Svg>

const UserIcon = ({ focus }) => <Svg xmlns="http://www.w3.org/2000/svg" style={tw`w-7 h-7 ${focus ? 'text-rose-600' : 'text-gray-300'} mx-auto`} viewBox="0 0 20 20" fill="currentColor">
  <Path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
</Svg>

const GridIcon = ({ focus }) => <Svg xmlns="http://www.w3.org/2000/svg" style={tw`w-7 h-7 ${focus ? 'text-rose-600' : 'text-gray-300'} mx-auto`} viewBox="0 0 20 20" fill="currentColor">
  <Path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
</Svg>


const ChatIcon = ({ focus }) => <Svg style={tw`w-7 h-7 ${focus ? 'text-rose-600' : 'text-gray-300'} mx-auto`} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <Path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z" />
</Svg>

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
      setUserLocation(location || Date.now());
    } else {
      location = await RNLocation.getLatestLocation({ timeout: 10000 })
      setUserLocation(location || Date.now());
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
          <AuthStackNavigator.Screen name="HomeScreen" component={HomeScreens} />
        </>
      </AuthStackNavigator.Navigator>
    )
  }

  // ! Bottom Tab Navigatior
  const BottomTabNavigator = createBottomTabNavigator()
  const HomeScreens = () => {
    return (
      <BottomTabNavigator.Navigator
        tabBar={props => <MyTabBar {...props} />}

        screenOptions={{
          showLabel: false,
          headerShown: false,
          tabBarHideOnKeyboard: true
        }}
        initialRouteName="Home"
      >
        <BottomTabNavigator.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: (focus) => <CollectionIcon focus={focus} />,
          }}
        />
        <BottomTabNavigator.Screen
          name="Rides"
          component={ComingSoon3}
          options={{
            tabBarIcon: (focus) => <GridIcon focus={focus} />,
          }}
        />
        <BottomTabNavigator.Screen
          name="History"
          component={ComingSoon}
          options={{
            tabBarIcon: (focus) => <ChatIcon focus={focus} />,
          }}
        />
        <BottomTabNavigator.Screen
          name="MyProfile"
          component={ComingSoon2}
          options={{
            tabBarIcon: (focus) => <UserIcon focus={focus} />,
          }}
        />
      </BottomTabNavigator.Navigator>
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
