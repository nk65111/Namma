import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useReduxDevToolsExtension } from '@react-navigation/devtools'
import Splash from './screens/Splash'
import IntroScreen from './screens/IntroScreen'
import { createStackNavigator } from '@react-navigation/stack'

//screen 
import NavigatorTab from './NavigatorTab';
import Login from './screens/AuthScreens/Login'
import OTPScreen from './screens/AuthScreens/OTPScreen'
import LiscencePic from './screens/AuthScreens/LiscencePic';
import BankDetail from './screens/AuthScreens/BankDetail';
import VehicalDetail from './screens/AuthScreens/VehicalDetail';
import ProfilePic from './screens/AuthScreens/ProfilePic';
import AboutYou from './screens/AuthScreens/AboutYou';

import messaging from '@react-native-firebase/messaging';
import RNLocation from 'react-native-location';
import { useDispatch } from 'react-redux';
import useSession from './hooks/useSession';

import { setCurrentLocation } from './slices/travelSlice';
import { refetchLocation } from './utils/constant';

import { Data } from './utils/routeData';
import { getLocation } from './hooks';
import { DriverService } from './services'
import { navigate } from './helpers/RootNavigation'

RNLocation.configure({
  distanceFilter: 1
});

const Routes = () => {
  const TIME_MS = 10000;
  const dispatch = useDispatch();
  const navigationRef = React.useRef();
  useReduxDevToolsExtension(navigationRef);
  const AuthStackNavigator = createStackNavigator();

  const [user] = useSession();
  const [jumpScreen, setJumpScreen] = React.useState('IntroScreen');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [animationLoading, setAnimationLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState();

  useEffect(() => {
    if (user) {
      if (user?.kycStatus !== 'COMPLETED') {
        setJumpScreen(Data[user?.onboardCount]);
        setLoading(false)
      } else {
        setJumpScreen("HomeScreen");
      }
    }
  }, [user])

  useEffect(() => {
    if (jumpScreen) {
      navigate(jumpScreen)
    }
  }, [jumpScreen])

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      setFcmToken(fcmToken);
      console.log("Your Firebase Token is:", fcmToken);
    } else {
      console.log("Failed", "No token received");
    }
  }

  const permissionHandle = async () => {
    let location = ''
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse'
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
      dispatch(
        setCurrentLocation({
          "description": "",
          "location": { "lat": location?.latitude, "lng": location?.longitude }
        })
      );

      let place = await getLocation({ lat: location?.latitude, long: location?.longitude });
      place = place.data?.results[0]?.formatted_address;
      console.log("place ", place)
      dispatch(
        setCurrentLocation({
          "description": place || "",
          "location": { "lat": location?.latitude, "lng": location?.longitude }
        })
      )
    }

    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        getFcmToken()
        console.log('Authorization status:', authStatus);
      }
    } catch (e) {
      console.log("Authorization error:", e)
    }
  }

  useEffect(() => {
    if (user?.id && fcmToken) {
      DriverService.updateProfile({
        deviceToken: fcmToken,
      }).then(data => {
        console.log(data);
      })
    }
  }, [user, fcmToken]);


  useEffect(() => {
    permissionHandle();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      refetchLocation(dispatch)
    }, TIME_MS);
    return () => clearInterval(interval);
  }, [])

  const AuthStack = ({ routeName }) => {
    return (
      <AuthStackNavigator.Navigator
        screenOptions={{ headerShown: false, }}
        initialRouteName={"IntroScreen"}
      >
        <>
          <AuthStackNavigator.Screen name="IntroScreen" component={IntroScreen} />
          <AuthStackNavigator.Screen name="Login" component={Login} />
          <AuthStackNavigator.Screen name="OTP" component={OTPScreen} />
          <AuthStackNavigator.Screen name="LIENCE_PIC" component={LiscencePic} />
          <AuthStackNavigator.Screen name="BANK_DETAIL" component={BankDetail} />
          <AuthStackNavigator.Screen name="VEHICLE_DETAIL" component={VehicalDetail} />
          <AuthStackNavigator.Screen name="PROFILE_PIC" component={ProfilePic} />
          <AuthStackNavigator.Screen name="AboutYou" component={AboutYou} />
          <AuthStackNavigator.Screen name="HomeScreen" component={NavigatorTab} />
        </>
      </AuthStackNavigator.Navigator>
    )
  }

  return !loading && !animationLoading ? (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  ) :
    (
      <Splash setLoading={setAnimationLoading} />
    )
}

export default Routes;
