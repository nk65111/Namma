import { Avatar, Icon, Input } from 'native-base'
import React from 'react'
import { Image, Text, TextInput, View } from 'react-native'
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import tw from 'twrnc'

const Search = ({ style }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-7 h-7 ${style}`}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </Svg>
)

function Home() {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={tw`flex-1 bg-white`}>
      <Animated.View entering={SlideInUp.duration(500)} style={tw` pt-4 px-4 flex-row items-center justify-between`}>
        <Input w={{
          base: "75%",
          md: "25%"
        }}
          style={tw`text-base mb-1.5`}
          variant="rounded"
          size={'2xl'}
          InputLeftElement={<Icon as={<Search style={'ml-2'} />} size={5} />} placeholder="Search Destination" />

        <Avatar bg="cyan.500" style={tw`border-4 border-gray-100`} alignSelf="center" size="md" source={{
          uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        }} />

      </Animated.View>

      <View style={tw`flex-1 items-center justify-center`}>
        <Image
          style={{ width: 360, height: 300 }}
          source={require('../../assets/images/ComingSoon.gif')}
        />
      </View>
    </Animated.View>
  )
}

export default Home