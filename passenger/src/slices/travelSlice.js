import { createSlice } from "@reduxjs/toolkit";
// import { groupBy } from "../utils/constant";
import moment, { duration } from "moment";

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
            let upcomingRide = action.payload?.upcomingRide;

            if (upcomingRide.id) {

                let metadata = JSON.parse(upcomingRide?.metadata)
                upcomingRide = {
                    id: upcomingRide.id,
                    pickUpLocation: metadata.pickUpLocation,
                    dropLocation: metadata.dropLocation,
                    status: upcomingRide.status,
                    travelDistance: `${upcomingRide?.travelDistance} KM`,
                    travelTime: `${moment.duration(upcomingRide.travelTime).get('hours') > 0 ? `${moment.duration(upcomingRide.travelTime).get('hours')} hours ` : ''}${moment.duration(upcomingRide.travelTime).get('minutes') > 0 ? `${moment.duration(upcomingRide.travelTime).get('minutes')} minutes ` : ''}`,
                    pickUpTime: moment(upcomingRide.pickUpTime, "HH:mm:ss").format(),
                    pickUpDate: upcomingRide.date,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            }

            state.upcomingRide = upcomingRide || null;
            let rides = action.payload?.rides?.reduce((group, ride) => {
                let key = moment(ride.date).format('DD-MMM-YYYY')

                let metadata = JSON.parse(ride?.metadata)
                group[key] = group[key] ?? [];
                let formattedRide = {
                    id: ride.id,
                    pickUpLocation: metadata.pickUpLocation,
                    dropLocation: metadata.dropLocation,
                    status: ride.status,
                    travelDistance: `${ride.travelDistance} KM`,
                    travelTime: `${moment.duration(ride.travelTime).get('hours') > 0 ? `${moment.duration(ride.travelTime).get('hours')} hours ` : ''}${moment.duration(ride.travelTime).get('minutes') > 0 ? `${moment.duration(ride.travelTime).get('minutes')} minutes ` : ''}`,
                    pickUpTime: moment(ride.pickUpTime, "HH:mm:ss").format(),
                    pickUpDate: ride.date,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
                group[key].push(formattedRide);
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
export const selectUpcomingRide = (state) => state.travel.upcomingRide?.id ? state.travel.upcomingRide : null;

export default travelSlice.reducer;