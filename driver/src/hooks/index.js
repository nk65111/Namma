import axios from "axios"
import { GOOGLE_MAP_API_KEY } from "../common/config"
import { useMutation } from "react-query"
import { useDispatch } from "react-redux"
import { setTravelTimeInfo } from "../slices/travelSlice"
import { generateOtp, updateProfile, verifyOtp, verifyToken } from "../services/service"
import { useNavigation } from "@react-navigation/native"
import { Data } from "../utils/routeData"
import { setUserDetails } from "../slices/userSlice"

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

export const useValidateToken = (callback) => {
    const dispatch = useDispatch()
    return useMutation((token) => verifyToken(token), {
        onSuccess: (response) => {
            dispatch(setUserDetails({ user: response.data.user }));
            if (callback)
                callback(response.data)
        },
        onError: (e) => {
            console.log(e?.message)
        }
    })
};

export const useGenerateOtp = (token, callback) => {
    return useMutation((token, phoneNumber) => generateOtp(token, phoneNumber), {
        onSuccess: (response) => {
            if (callback)
                callback();
        },
        onError: (e) => {
            console.log(e)
        }
    })
};
export const useVerifyOtp = (callback) => {
    return useMutation((token, data) => verifyOtp(token, data), {
        onSuccess: async (response) => {
            await AsyncStorage.setItem("token", response.data.token);
            if (callback)
                callback(response.data.token);
        },
        onError: (e) => {
            console.log(e)
        }
    })
};
export const useUpdateProfile = (callback) => {
    const dispatch = useDispatch();
    return useMutation((token, data) => updateProfile(token, data), {
        onSuccess: async (response) => {
            dispatch(setUserDetails({ user: response.data.user }));
            if (callback)
                callback();
        },
        onError: (e) => {
            console.log(e)
        }
    })
};

