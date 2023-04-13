import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import tw from 'twrnc'

function MyTabBar({ state, descriptors, navigation }) {

    return (
        <Animated.View entering={SlideInDown.duration(1000)} style={tw`flex-row bg-white rounded-full p-3 m-3 shadow-lg absolute bottom-0`}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, position: 'relative'}}
                    >
                        <View style={tw`text-gray-200`}>
                            {options.tabBarIcon(isFocused)}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </Animated.View>
    );
}

export default MyTabBar