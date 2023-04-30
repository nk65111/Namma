import { Avatar, ScrollView } from 'native-base'
import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import tw from 'twrnc'
import { colors } from '../../utils/constant'
import { useNavigation } from '@react-navigation/native'
import { AuthService } from '../../services/auth.service';
import { SetLocalStorage, GetLocalStorage, RemoveLocalStorage } from '../../helpers/FunctionHelper';

function MyProfile() {

  const navigator = useNavigation();
  const [userInfo, setUserInfo] = useState();
  const [isAuthChecked, setIsAuthChecked] = useState();

  const validateIsLogin = async () => {
    const isAuth = await GetLocalStorage('IS_AUTH');
    const userData = await GetLocalStorage('DRIVER_DATA', true);
    const accessToken = await GetLocalStorage('AUTH_TOKEN_KEY');
    if (isAuth && userData && accessToken) {
      setIsAuthChecked(true);
      setUserInfo(userData);
    }
  }

  useEffect(() => {
    validateIsLogin();
  }, []);


  const logout = async () => {
    await RemoveLocalStorage('IS_AUTH', 0);
    await RemoveLocalStorage('DRIVER_DATA');
    await RemoveLocalStorage('AUTH_TOKEN_KEY');
    navigator.navigate('Login');
  }
  return (
    <Animated.View entering={SlideInRight} exiting={SlideInLeft} style={tw`flex-1 flex-col relative`}>
      <LinearGradient colors={colors.gradient_blue} style={tw`h-[150px]`}>
      </LinearGradient>
      <View style={tw`absolute top-20 self-center`}>
        <Avatar zIndex={20} bg="cyan.500" style={tw`border-4 border-gray-100`} alignSelf="center" size="2xl" source={{
          uri: userInfo?.profileImage || "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        }} />
        <Text style={tw`text-xl text-center py-1 text-gray-600`}>{userInfo?.name}</Text>
      </View>
      <TouchableOpacity onPress={logout} style={tw`absolute top-4 right-4 z-10 bg-white p-2 rounded-full`}>
        <Icon name='logout' size={28} style={tw`text-rose-600`} />
      </TouchableOpacity>


      <View style={tw`p-6 pt-24 flex-grow flex-1`}>
        <TouchableOpacity style={tw`bg-white shadow-xl shadow-gray-200 py-3 px-4 rounded-2xl flex-row items-center`}>
          <Icon name='account' size={36} style={tw`text-yellow-400`} />
          <Text style={tw`text-lg px-2 flex-grow text-gray-600`}>Profile Details</Text>
          <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-8 h-8 text-gray-600`}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-white shadow-xl shadow-gray-200 py-3 px-4 my-6 rounded-2xl flex-row items-center`}>
          <Icon name='bank' size={36} style={tw`text-blue-500`} />
          <Text style={tw`text-lg px-2 flex-grow text-gray-600`}>Account Details</Text>
          <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-8 h-8 text-gray-600`}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-white shadow-xl shadow-gray-200 py-3 px-4 rounded-2xl flex-row items-center`}>
          <Icon name='account-clock' size={36} style={tw`text-purple-700`} />
          <Text style={tw`text-lg px-2 flex-grow text-gray-600`}>Transactions History</Text>
          <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-8 h-8 text-gray-600`}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigator.navigate('wallet')} style={tw`bg-white shadow-xl shadow-gray-200 py-3 px-4 rounded-2xl flex-row items-center mt-6`}>
          <Icon name='wallet' size={36} style={tw`text-orange-700`} />
          <Text style={tw`text-lg px-2 flex-grow text-gray-600`}>Wallet</Text>
          <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-8 h-8 text-gray-600`}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </Svg>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={logout} style={tw`bg-white shadow-xl shadow-gray-200 py-4 px-4 max-w-[300px] mx-auto rounded-2xl flex-row items-center`}>
        <Text style={tw`text-xl font-medium flex-grow text-rose-500 text-center`}>Log Out</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default MyProfile