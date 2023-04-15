import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useRef } from "react";
import {
    selectDestination,
    selectOrigin,
    setTravelInfo,
} from "../slices/travelSlice";
import { useDispatch, useSelector } from "react-redux";

import { GOOGLE_MAPS_API_KEY } from "../services/config";
import MapViewDirections from "react-native-maps-directions";
import tw from "twrnc";

const Map = () => {
    const dispatch = useDispatch();
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const mapRef = useRef(null);

    useEffect(() => {
        if (!origin || !destination) return;

        mapRef.current?.fitToSuppliedMarkers(["origin", "destination"], {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        });
    }, [origin, destination]);

    useEffect(() => {
        if (!origin || !destination) return;

        const getTravelTime = async () => {
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            dispatch(setTravelInfo(data.rows[0].elements[0]));
        };

        getTravelTime();
    }, [origin, destination, GOOGLE_MAPS_API_KEY]);

    return<></>
    // return (
    //     <MapView
    //         ref={mapRef}
    //         initialRegion={{
    //             latitude: origin?.location?.lat || 37.78825,
    //             longitude: origin?.location?.lng || -122.4324,
    //             latitudeDelta: 0.005,
    //             longitudeDelta: 0.005,
    //         }}
    //         mapType="mutedStandard"
    //         style={tw`flex-1 bg-red-100`}
    //     >
    //         {origin && destination && (
    //             <MapViewDirections
    //                 origin={origin?.description}
    //                 destination={destination?.description}
    //                 apikey={GOOGLE_MAPS_API_KEY}
    //                 strokeWidth={3}
    //                 strokeColor="blue"
    //                 lineDashPattern={[0]}
    //             />
    //         )}

    //         {origin?.location && (
    //             <Marker
    //                 coordinate={{
    //                     latitude: origin?.location?.lat,
    //                     longitude: origin?.location?.lng,
    //                 }}
    //                 title="Origin"
    //                 description={origin?.description}
    //                 identifier="origin"
    //             />
    //         )}

    //         {destination?.location && (
    //             <Marker
    //                 coordinate={{
    //                     latitude: destination?.location?.lat,
    //                     longitude: destination?.location?.lng,
    //                 }}
    //                 title="Destination"
    //                 description={destination?.description}
    //                 identifier="destination"
    //             />
    //         )}
    //     </MapView>
    // );
};

export default Map;