import ImagePicker from 'react-native-image-crop-picker'
import RNLocation from 'react-native-location'
import { setCurrentLocation } from '../slices/travelSlice';
RNLocation.configure({
    distanceFilter: 1
});
export const colors = {
    blue: '#0096FF',
    black: '#222',
    white: '#fff'
}


export const PickImage = async (Location) => {
    console.log(Location)
    if (Location == 'Liscence') {

        let TestPromise = new Promise((resolve, reject) => {
            ImagePicker.openPicker({
                width: 500,
                height: 300,
                cropping: true,
                multiple: false,
            })
                .then((image) => {
                    console.log('image', image)
                    let newImageUrl = image.path
                    resolve({ success: true, response: newImageUrl })
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
                    console.log('image', image)
                    let newImageUrl = image.path
                    resolve({ success: true, response: newImageUrl })
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
    dispatch(setCurrentLocation(location))
}