import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-test-renderer";

const initialState = {
    origin: null,
    destination: null,
    travelInfo: null,
    currentLocation: null
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
            state.currentLocation = action.payload;
        },
    },
});

export const { setOrigin, setDestination, setTravelTimeInfo, setCurrentLocation } = travelSlice.actions;

export const selectOrigin = (state) => state.travel.origin;
export const selectDestination = (state) => state.travel.destination;
export const selectTravelTimeInfo = (state) => state.travel.travelTimeInfo;
export const selectCurrentLocation = (state) => state.travel.currentLocation;

export default travelSlice.reducer;