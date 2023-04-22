import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Svg, { Path } from 'react-native-svg'
import tw from 'twrnc'

function BackButton({ extra }) {
  const navigation = useNavigation();
  return (
    <>
      {
        navigation.canGoBack()
          ?
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 rounded-full bg-white flex-row items-center justify-center p-1 ${extra}`}>
            <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`text-gray-800`}>
              <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </Svg>
          </TouchableOpacity>
          :
          <></>
      }
    </>
  )
}

export default BackButton