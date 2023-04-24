import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
    origin: null,
    destination: null,
    travelInfo: null,
    currentLocation: null,
    rides: [],
    ride: null,
    upcomingRide: null
};

export const travelSlice = createSlice({
    name: "travel",
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setTravelTimeInfo: (state, action) => {
            state.travelInfo = action.payload;
        },
        setCurrentLocation: (state, action) => {
            state.origin = action.payload;
            state.currentLocation = action.payload;
        },
        setRides: (state, action) => {

            state.upcomingRide = action.payload[0] || null;
            let rides = action.payload?.reduce((group, ride) => {
                let key = moment(ride.pickUpDate).format('DD-MMM-YYYY')
                group[key] = group[key] ?? [];
                group[key].push(ride);
                return group;
            }, {});

            state.rides = rides || [];
        },
        setRide: (state, action) => {
            state.ride = action.payload;
        },
    },
});

export const { setOrigin, setDestination, setTravelTimeInfo, setCurrentLocation, setRides, setRide } = travelSlice.actions;

export const selectOrigin = (state) => state.travel.origin;
export const selectDestination = (state) => state.travel.destination;
export const selectTravelTimeInfo = (state) => state.travel.travelInfo;
export const selectCurrentLocation = (state) => state.travel.currentLocation;

export const selectRides = (state) => state.travel.rides;
export const selectRide = (state) => state.travel.ride;
export const selectUpcomingRide = (state) => state.travel.upcomingRide;

export default travelSlice.reducer;