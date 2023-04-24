import axios from "axios"
import { GOOGLE_MAP_API_KEY } from "../services/config"
import { useMutation } from "react-query"
import { useDispatch } from "react-redux"
import { setTravelTimeInfo } from "../slices/travelSlice"
import { sendOtp } from "../services/service"

export const getLocation = ({ lat, long }) => {
    const MAP_URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_MAP_API_KEY}`
    return axios
        .create({
            headers: {
                'Content-type': 'application/json',
            },
        })
        .get(`${MAP_URL}`)
}
const getTravelTime = (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin?.location?.lat},${origin?.location?.lng}&destinations=${destination?.location?.lat},${destination?.location?.lat}&key=${GOOGLE_MAP_API_KEY}`
    return axios.get(url)
}

export const useGetTravelTime = ({ origin, destination }) => {
    const dispatch = useDispatch();
    return useMutation(() => getTravelTime(origin, destination), {
        onSuccess: (response) => {
            if (response?.data?.rows[0].elements[0]?.status == "OK") {
                dispatch(setTravelTimeInfo(response?.data?.rows[0].elements[0]))
            }
        },
        onError: (e) => {
            console.log(e)
        }
    })
};

export const useSendOTP = (phoneNumber) => {
    return useMutation(() => sendOtp({ phoneNumber }), {
        onSuccess: (response) => {
            console.log(response)
        },
        onError: (e) => {
            console.log(e)
        }
    })
};
