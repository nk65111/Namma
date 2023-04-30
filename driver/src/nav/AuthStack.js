import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

//screen 
import NavigatorTab from '../NavigatorTab';
import IntroScreen from '../screens/IntroScreen'
import Login from '../screens/AuthScreens/Login';
import OTPScreen from '../screens/AuthScreens/OTPScreen';
import LiscencePic from '../screens/AuthScreens/LiscencePic';
import BankDetail from '../screens/AuthScreens/BankDetail';
import VehicalDetail from '../screens/AuthScreens/VehicalDetail';
import ProfilePic from '../screens/AuthScreens/ProfilePic';
import AboutYou from '../screens/AuthScreens/AboutYou';
import Wallet from '../screens/wallet';

const AuthStack = (props) => {
    const AuthStackNavigator = createStackNavigator();
    const navigation = useNavigation();
    const [jumpScreen, setJumpScreen] = useState('IntroScreen');

    useEffect(() => {
        if (props.user) {
            if (props.user?.kycStatus !== 'COMPLETED') {
                setJumpScreen(props.user?.onboardingStep);
            } else {
                setJumpScreen("HomeScreen");
            }
        }
    }, [props.user]);

    useEffect(() => {
        if (jumpScreen) {
            navigation.navigate(jumpScreen)
        }
    }, [jumpScreen]);

    return (
        <AuthStackNavigator.Navigator
            screenOptions={{ headerShown: false, }}
            initialRouteName={"IntroScreen"}
        >
            <>
                <AuthStackNavigator.Screen name="IntroScreen" component={IntroScreen} />
                <AuthStackNavigator.Screen name="Login" component={Login} />
                <AuthStackNavigator.Screen name="OTP" component={OTPScreen} />
                <AuthStackNavigator.Screen name="DRIVING_LICENCE" component={LiscencePic} />
                <AuthStackNavigator.Screen name="BANK_DETAIL" component={BankDetail} />
                <AuthStackNavigator.Screen name="VEHICLE_DETAIL" component={VehicalDetail} />
                <AuthStackNavigator.Screen name="PROFILE_PIC" component={ProfilePic} />
                <AuthStackNavigator.Screen name="AboutYou" component={AboutYou} />
                <AuthStackNavigator.Screen name="HomeScreen" component={NavigatorTab} />
                <AuthStackNavigator.Screen name="wallet" component={Wallet} />
            </>
        </AuthStackNavigator.Navigator>
    )
}

export default AuthStack;