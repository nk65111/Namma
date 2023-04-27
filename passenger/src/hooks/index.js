import axios from "axios"
import { GOOGLE_MAP_API_KEY } from "../services/config"
import { useMutation } from "react-query"
import { useDispatch } from "react-redux"
import { setTravelTimeInfo } from "../slices/travelSlice"
import { generateOtp, updateProfile, verifyOtp, verifyToken } from "../services/service"
import { useNavigation } from "@react-navigation/native"
import { Data } from "../utils/routeData"
import { setUserDetails } from "../slices/userSlice"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

export const useValidateToken = (callback, error) => {
    const dispatch = useDispatch()
    return useMutation((token) => verifyToken(token), {
        onSuccess: (response) => {
            console.log(response.data)
            dispatch(setUserDetails({ user: response.data }));
            if (callback)
                callback(response.data)
        },
        onError: (e) => {
            console.log(e)
            if (error)
                error();
            console.log(e?.message)
        }
    })
};

export const useGenerateOtp = (token, callback) => {
    return useMutation((data) => generateOtp(data), {
        onSuccess: (response) => {
            if (callback)
                callback();
        },
        onError: (e) => {
            console.log('useGenerateOtp error')
            console.log(e)
        }
    })
};

export const useVerifyOtp = (callback) => {
    return useMutation((data) => verifyOtp(data), {
        onSuccess: async (response) => {
            await AsyncStorage.setItem("raahi_token", response.data.token);
            if (callback)
                callback(response.data.token);
        },
        onError: (e) => {
            console.log('useVerifyOtp err')
            console.log(e)
        }
    })
};

export const useUpdateProfile = (callback) => {
    const dispatch = useDispatch();
    return useMutation((data) => updateProfile(data), {
        onSuccess: async (response) => {
            if (response.data.user)
                dispatch(setUserDetails({ user: response.data.user }));
            if (callback)
                callback();
        },
        onError: (e) => {
            console.log(e)
        }
    })
};

