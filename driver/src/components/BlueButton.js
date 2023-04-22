import { Text } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import tw from 'twrnc'

function BlueButton({ text, onPress, extra = '', disabled = false }) {
    return (
        <TouchableOpacity disabled={disabled} onPress={() => onPress ? onPress() : {}} style={tw`${disabled ? 'bg-gray-300' : 'bg-blue-500'} py-3 px-6 min-w-32 rounded-lg ${extra}`}>
            <Text style={tw`text-xl text-center font-medium text-white`}>{text}</Text>
        </TouchableOpacity>
    )
}

export default BlueButton