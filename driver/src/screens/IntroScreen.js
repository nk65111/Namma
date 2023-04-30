import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeIn } from 'react-native-reanimated'
import tw from 'twrnc'
import { SvgCssUri } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native'
import PrimaryButton from '../components/PrimaryButton'
import { colors } from '../utils/constant'

let data = [
  {
    title: 'Fuel Usage',
    uri: "https://res.cloudinary.com/ankit628792/image/upload/v1682850574/fuel.svg",
    desc: 'reduced by earning more with usage of less fuel per ride'
  },
  {
    title: 'More Earning',
    uri: "https://res.cloudinary.com/ankit628792/image/upload/v1682850575/earning.svg",
    desc: 'with batching and opportunity to get regular passenger increases the chances of earning',
  },
  {
    title: '0% Commission',
    uri: "https://res.cloudinary.com/ankit628792/image/upload/v1682777599/payment.svg",
    desc: "transfer your earning to bank with 0% commission"
  },
]

const TIME_MS = 5000;

function IntroScreen() {
  const navigation = useNavigation()
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (active == 2) {
        setActive(0)
      }
      else {
        setActive(active + 1)
      }
    }, TIME_MS);

    return () => clearInterval(interval);
  })

  return (
    <Animated.View entering={FadeIn} style={tw`flex-1 items-center justify-center`}>
      <LinearGradient colors={[colors.white, colors.white]} style={tw`flex-1 items-center justify-center h-full w-full relative`}>
        {
          active == 0 ? <View style={tw`flex-1 w-full px-5 py-20`}>
            <SvgCssUri
              style={tw`w-full h-80`}
              uri={"https://res.cloudinary.com/ankit628792/image/upload/v1682850574/fuel.svg"}
            />
            <Text style={tw`text-4xl font-medium text-blue-600 mx-auto mt-6`}>{data[active].title}</Text>
            <Text style={tw`text-lg text-gray-400 mx-auto mt-1 text-center`}>{data[active].desc}</Text>
          </View>
            :
            active == 1 ?
              <View style={tw`flex-1 w-full px-5 py-20`}>
                <SvgCssUri
                  style={tw`w-full h-80`}
                  uri={"https://res.cloudinary.com/ankit628792/image/upload/v1682850575/earning.svg"}
                />
                <Text style={tw`text-4xl font-medium text-blue-600 mx-auto mt-6`}>{data[active].title}</Text>
                <Text style={tw`text-lg text-gray-400 mx-auto mt-1 text-center`}>{data[active].desc}</Text>
              </View>
              :
              <View style={tw`flex-1 w-full px-5 py-20`}>
                <SvgCssUri
                  style={tw`w-full h-80`}
                  uri={"https://res.cloudinary.com/ankit628792/image/upload/v1682777599/payment.svg"}
                />
                <Text style={tw`text-4xl font-medium text-blue-600 mx-auto mt-6`}>{data[active].title}</Text>
                <Text style={tw`text-lg text-gray-400 mx-auto mt-1 text-center`}>{data[active].desc}</Text>
              </View>
        }
        <View style={tw`w-full px-10 pb-6 absolute bottom-2 left-0`}>
          <PrimaryButton onPress={() => navigation.navigate('Login')} text={'Get Started'} extra=' my-6' />
        </View>
      </LinearGradient>
    </Animated.View >
  )
}

export default IntroScreen