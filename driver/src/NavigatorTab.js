import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CustomBottomTab from "./components/BottomTabs/CustomButtonTab";
import Home from "./screens/HomeScreens/Home";
import MyProfile from "./screens/HomeScreens/MyProfile";
import ComingSoon2 from './screens/ComingSoon2'
import ComingSoon3 from './screens/ComingSoon3'

const Tab = createBottomTabNavigator();

export default function NavigatorTab() {
    return (
        <Tab.Navigator tabBar={(props) => <CustomBottomTab {...props} />}>
            <Tab.Group screenOptions={{ headerShown: false }}>
                <Tab.Screen options={{ tabBarLabel: 'Home' }} name="Home" component={Home} />
                <Tab.Screen options={{ tabBarLabel: 'Route2' }} name="Route2" component={ComingSoon2} />
                <Tab.Screen options={{ tabBarLabel: 'Route3' }} name="Route3" component={ComingSoon3} />
                <Tab.Screen options={{ tabBarLabel: 'Profile' }} name="Profile" component={MyProfile} />
            </Tab.Group>
        </Tab.Navigator>
    )
}
