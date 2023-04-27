import ImagePicker from 'react-native-image-crop-picker'
import RNLocation from 'react-native-location'
import { setCurrentLocation } from '../slices/travelSlice';
// import jwt_decode from "jwt-decode";
import { useState } from 'react';
import { useEffect } from 'react';
import { getLocation } from '../hooks';

RNLocation.configure({
    distanceFilter: 1
});

export const colors = {
    blue: '#007FFF',
    white: "#FFF",
    black: '#222',
    white: '#fff',
    light_grey: "#F5F5F5",
    grey: "#999",
    yellow: "#F0BA2B",
    red: "#FA5805",
    gradient_blue: ['#007FFF', '#007FFF', '#0CAFFF', '#0CAFFF'],
    gradient_red: ['#e53e3e', '#f56565'],
    gradient_yellow: ['#E9B93B', '#E9A800', '#F1CD6F'],

}

export const decodeToken = async () => {
    const jwtToken = await AsyncStorage.getItem("raahi__token");

    if (!jwtToken) {
        return false;
    }
    var decoded = jwt_decode(jwtToken);
    return decoded?.userInfo
}


// export const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});


export const uploadImage = async (image) => {
    console.log(image)
    try {

        const formData = new FormData();
        formData.append('file', {
            uri: image.uri,
            type: image.type,
            name: 'test.jpg'
        });
        formData.append('upload_preset', 'ankit_kumar');

        const cloudinaryURL = 'https://api.cloudinary.com/v1_1/ankit628792/image/upload';

        const response = await fetch(cloudinaryURL, {
            method: 'POST',
            body: formData
        });

        let res = await response.json();
        if (res.secure_url)
            console.log(`File "${image?.name}" Uploaded successfully`, { id: 'success' })
        else
            console.log(`Unable to Upload File "${image?.name}"`, { id: 'error' });

        return res.secure_url

    } catch (error) {
        console.log("err ", error)
        return null
    }
}

export default function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay);
        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);

    return debouncedValue;
}

export const PickImage = async (Location) => {
    if (Location == 'Liscence') {

        let TestPromise = new Promise((resolve, reject) => {
            ImagePicker.openPicker({
                width: 500,
                height: 300,
                cropping: true,
                multiple: false,
            })
                .then((image) => {
                    resolve({ success: true, response: image })
                })
                .catch((error) => {
                    reject({ success: false, response: error })
                })
        })
        return TestPromise
    }
    else {

        let TestPromise = new Promise((resolve, reject) => {
            ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
                multiple: false,
            })
                .then((image) => {
                    resolve({ success: true, response: image })
                })
                .catch((error) => {
                    reject({ success: false, response: error })
                })
        })
        return TestPromise
    }
}


export const refetchLocation = async (dispatch) => {
    let location = ''
    let permission = await RNLocation.checkPermission({
        ios: 'whenInUse', // or 'always'
        android: {
            detail: 'coarse' // or 'fine'
        }
    });

    if (!permission) {
        permission = await RNLocation.requestPermission({
            ios: "whenInUse",
            android: {
                detail: "coarse",
                rationale: {
                    title: "We need to access your location",
                    message: "We use your location to show to find nearest match",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel"
                }
            }
        })
        location = await RNLocation.getLatestLocation({ timeout: 10000 });
    } else {
        location = await RNLocation.getLatestLocation({ timeout: 10000 })
    }

    if (location) {
        // let newLocation = { "description": "", "location": { "lat": location?.latitude, "lng": location?.longitude } }
        // location = newLocation;
        dispatch(setCurrentLocation({ "description": "", "location": { "lat": location?.latitude, "lng": location?.longitude } }))

        let place = await getLocation({ lat: location?.latitude, long: location?.longitude });
        place = place.data?.results[0]?.formatted_address;
        dispatch(setCurrentLocation({ "description": place || "", "location": { "lat": location?.latitude, "lng": location?.longitude } }))
        // location.description = place

        // dispatch(setCurrentLocation(location))
    }

}