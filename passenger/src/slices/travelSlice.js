import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    origin: null,
    destination: null,
    travelInfo: null,
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
    },
});

export const { setOrigin, setDestination, setTravelTimeInfo } = travelSlice.actions;

export const selectOrigin = (state) => state.travel.origin;
export const selectDestination = (state) => state.travel.destination;
export const selectTravelTimeInfo = (state) => state.travel.travelTimeInfo;

export default travelSlice.reducer;