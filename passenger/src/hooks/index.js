import axios from "axios"
import { GOOGLE_MAP_API_KEY } from "../services/config"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useDispatch } from "react-redux"
import { setRides, setTravelTimeInfo } from "../slices/travelSlice"
import { addRide, cancelRide, generateOtp, getRides, getToken, updateProfile, updateRide, verifyOtp, verifyToken } from "../services/service"
import { setToken, setUserDetails } from "../slices/userSlice"
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

const useGetRides = (token) => {
    const dispatch = useDispatch()
    useQuery('userRides', () => getRides(token), {
        staleTime: 300000, onSuccess: (res) => {
            if (res.data?.rides) {
                dispatch(setRides(res.data || []))
            }
        }
    })

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
    const dispatch = useDispatch()
    return useMutation((data) => verifyOtp(data), {
        onSuccess: async (response) => {
            await AsyncStorage.setItem("raahi_token", response.data.token);
            dispatch(setToken(response.data.token))
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
            if (response.data)
                dispatch(setUserDetails({ user: response.data }));
            if (callback)
                callback();
        },
        onError: (e) => {
            console.log(e)
        }
    })
};

export const useUpdateRide = (callback) => {
    return useMutation((data) => updateRide(data), {
        onSuccess: async (response) => {
            if (callback)
                callback();
        },
        onError: (e) => {
            console.log(e)
        }
    })
};

export const useAddRide = (callback) => {
    return useMutation((data) => addRide(data), {
        onSuccess: async (response) => {
            if (callback)
                callback();
        },
        onError: (e) => {
            console.log("err")
            console.log(e)
        }
    })
};
export const useCancelRide = (callback) => {
    const queryC = useQueryClient()
    return useMutation((data) => cancelRide(data), {
        onSuccess: async (response) => {
            queryC.invalidateQueries('userRides')
            if (callback)
                callback();
        },
        onError: (e) => {
            console.log(e)
        }
    })
};

