import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CustomBottomTab from "./components/BottomTabs/CustomButtonTab";
import Home from "./screens/HomeScreens/Home";
import MyProfile from "./screens/HomeScreens/MyProfile";
import MyRides from "./screens/Rides/MyRides";
import AddRide from "./screens/Rides/AddRide";

const Tab = createBottomTabNavigator();

export default function NavigatorTab() {
    return (
        <Tab.Navigator tabBar={(props) => <CustomBottomTab {...props} />}>
            <Tab.Group screenOptions={{ headerShown: false }}>
                <Tab.Screen options={{ tabBarLabel: 'Home' }} name="Home" component={Home} />
                <Tab.Screen options={{ tabBarLabel: 'Add Ride' }} name="Add Ride" component={AddRide} />
                <Tab.Screen options={{ tabBarLabel: 'Rides' }} name="Rides" component={MyRides} />
                <Tab.Screen options={{ tabBarLabel: 'Profile' }} name="Profile" component={MyProfile} />
            </Tab.Group>
        </Tab.Navigator>
    )
}
