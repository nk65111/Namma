import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import messaging from '@react-native-firebase/messaging';
import RNLocation from 'react-native-location';

//nav
import AuthStack from './nav/AuthStack'
import Splash from './screens/Splash';

import { setCurrentLocation } from './slices/travelSlice';
import { refetchLocation } from './utils/constant';
import { getLocation } from './hooks';
import { DriverService } from './services';
import { GetLocalStorage, SetLocalStorage } from './helpers/FunctionHelper'

RNLocation.configure({
  distanceFilter: 1
});

const Routes = () => {
  const TIME_MS = 100000;
  const dispatch = useDispatch();
  const navigationRef = React.useRef();
  useReduxDevToolsExtension(navigationRef);
  const [user, setUser] = useState();
  const [userLocation, setUserLocation] = useState(null);
  const [animationLoading, setAnimationLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [fcmToken, setFcmToken] = useState();

  const validateIsLogin = async () => {
    const isAuth = await GetLocalStorage('IS_AUTH');
    const userData = await GetLocalStorage('DRIVER_DATA', true);
    const accessToken = await GetLocalStorage('AUTH_TOKEN_KEY');
    console.log("data------", isAuth, userData, accessToken);
    if (isAuth && userData && accessToken) {
      setIsAuthChecked(true);
      setUser(userData);
    }
  }

  useEffect(() => {
    validateIsLogin();
  }, []);

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

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      SetLocalStorage('DEVICE_TOKEN', fcmToken);
      setFcmToken(fcmToken);
      console.log("Your Firebase Token is:", fcmToken);
    } else {
      console.log("Failed", "No token received");
    }
  }

  useEffect(() => {
    permissionHandle();
  }, [])

  useEffect(() => {
    if (isAuthChecked) {
      console.log(userLocation);
      const interval = setInterval(() => {
        DriverService.updateLocation((userLocation)).then(() => {
          SetLocalStorage("CURRENT_LOCATION", userLocation);
        })
      }, TIME_MS);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (isAuthChecked && fcmToken) {
      DriverService.updateProfile({
        deviceToken: fcmToken,
      }).then(data => {
        console.log(data);
      })
    }
  }, [isAuthChecked, fcmToken]);

  return !animationLoading ? (
    <NavigationContainer>
      <AuthStack user={user} />
    </NavigationContainer>
  ) :
    (
      <Splash setLoading={setAnimationLoading} />
    )
}

export default Routes;
