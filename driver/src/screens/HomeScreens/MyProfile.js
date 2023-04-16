import { Avatar, ScrollView } from 'native-base'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { SlideInRight } from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import tw from 'twrnc'
import { colors } from '../../utils/constant'

function MyProfile() {
  return (
    <Animated.View entering={SlideInRight} style={tw`flex-1 flex-col pb-20`}>
      <LinearGradient colors={colors.gradient_blue} style={tw`h-[150px]`}>
      </LinearGradient>
      <View style={tw`absolute top-20 self-center`}>
        <Avatar zIndex={20} bg="cyan.500" style={tw`border-4 border-gray-100`} alignSelf="center" size="2xl" source={{
          uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        }} />
        <Text style={tw`text-xl text-center py-1 text-gray-600`}>Topi Master</Text>
      </View>


      <View style={tw`p-6 pt-28 flex-grow`}>
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
      </View>
      <TouchableOpacity style={tw`bg-white shadow-xl shadow-gray-200 py-4 px-4 max-w-[300px] mx-auto rounded-2xl flex-row items-center`}>
        <Text style={tw`text-2xl flex-grow text-red-500 text-center`}>Log Out</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default MyProfile