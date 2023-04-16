import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ComingSoon from "./screens/ComingSoon";
import ComingSoon2 from "./screens/ComingSoon2";

import CustomBottomTab from "./components/BottomTabs/CustomButtonTab";
import Home from "./screens/HomeScreens/Home";
import MyProfile from "./screens/HomeScreens/MyProfile";

const Tab = createBottomTabNavigator();

export default function NavigatorTab() {
    return (
        <Tab.Navigator tabBar={props => <CustomBottomTab {...props} />}>
            <Tab.Group screenOptions={{ headerShown: false }}>
                <Tab.Screen options={{ tabBarLabel: 'Home' }} name="Home" component={Home} />
                <Tab.Screen options={{ tabBarLabel: 'Trips' }} name="Trips" component={ComingSoon} />
                <Tab.Screen options={{ tabBarLabel: 'History' }} name="History" component={ComingSoon2} />
                <Tab.Screen options={{ tabBarLabel: 'Profile' }} name="Profile" component={MyProfile} />
            </Tab.Group>
        </Tab.Navigator>
    )
}

// yarn add d3-shape
// yarn add react-native-redash
// yarn add react-native-vector-icons
