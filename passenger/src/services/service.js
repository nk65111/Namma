import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, endpoints } from "./config";

import axios from "axios"

const user = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${AsyncStorage.getItem("raahi_token").then(res => { if (!res._z) return ''; else res }).catch(e => '')}`
    }
})

// axios.interceptors.request.use(
//     config => {
//         config.headers['Authorization'] = `Bearer ${AsyncStorage.getItem("raahi_token").then(res => res).catch(e => '')}`;
//         return config;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );

export const getToken = async () => {
    let token = await AsyncStorage.getItem("raahi_token");
    return token;
}

export const verifyToken = (token) => {
    return user.get(endpoints.profile, { headers: { Authorization: `Bearer ${token}` } })
}

export const generateOtp = ({ token, phoneNumber }) => {
    return user.post(endpoints.generateOtp + `?phoneNumber=${phoneNumber}`, { headers: { Authorization: `Bearer ${token}` } })
}

export const verifyOtp = ({ token, data }) => {
    return user.post(endpoints.verifyOtp, data, { headers: { Authorization: `Bearer ${token}` } })
}

export const updateProfile = ({ token, data }) => {
    return user.put(endpoints.updateProfile, data, { headers: { Authorization: `Bearer ${token}` } })
}



export const addRide = ({ token, data }) => {
    return user.post(endpoints.addRide, data, { headers: { Authorization: `Bearer ${token}` } })
}
export const updateRide = ({ token, data }) => {
    return user.put(endpoints.updateRide, data, { headers: { Authorization: `Bearer ${token}` } })
}
export const getRides = (token) => {
    return user.get(endpoints.getRides, { headers: { Authorization: `Bearer ${token}` } })
}
export const cancelRide = ({ token, rideId }) => {
    return user.delete(endpoints.cancelRide + `/${rideId}`, { headers: { Authorization: `Bearer ${token}` } })
}