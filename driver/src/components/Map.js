import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useRef } from "react";
import {
    selectDestination,
    selectOrigin,
} from "../slices/travelSlice";
import { useDispatch, useSelector } from "react-redux";

import { GOOGLE_MAP_API_KEY } from "../common/config";
import MapViewDirections from "react-native-maps-directions";
import { StyleSheet } from "react-native";
import { useGetTravelTime } from "../hooks";

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

    let { isLoading, mutate } = useGetTravelTime({ origin, destination })

    useEffect(() => {
        if (!origin || !destination) return;
        if (origin && destination) {
            mutate()
        }
    }, [origin, destination, GOOGLE_MAP_API_KEY]);

    return (
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
                latitude: origin?.location?.lat || 27.594594594594593,
                longitude: origin?.location?.lng || 78.01532460294433,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
            mapType="terrain"
        >
            {origin && destination && (
                <MapViewDirections
                    origin={{ latitude: origin?.location?.lat, longitude: origin?.location?.lng }}
                    destination={{ latitude: destination?.location?.lat, longitude: destination?.location?.lng }}
                    apikey={GOOGLE_MAP_API_KEY}
                    strokeWidth={3}
                    strokeColor="black"
                />
            )}

            {origin?.location && (
                <Marker
                    coordinate={{
                        latitude: origin?.location?.lat,
                        longitude: origin?.location?.lng,
                    }}
                    title="Origin"
                    description={origin?.description}
                    identifier="origin"
                />
            )}

            {destination?.location && (
                <Marker
                    coordinate={{
                        latitude: destination?.location?.lat,
                        longitude: destination?.location?.lng,
                    }}
                    title="Destination"
                    description={destination?.description}
                    identifier="destination"
                />
            )}
        </MapView>
    );
};

export default Map;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1, //the container will fill the whole screen.
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        marginTop: -40,
        marginBottom: -20,
        ...StyleSheet.absoluteFillObject,
    },
});