import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, endpoints } from "../common/config";

import axios from "axios"

const user = axios.create({
    baseURL: BASE_URL,
})

export const getToken = async () => {
    let token = await AsyncStorage.getItem("raahi_token");
    return token;
}

export const verifyToken = (token) => {
    return user.get('/test', { headers: { Authorization: `Bearer ${token}` } })
}

export const generateOtp = (token, phoneNumber) => {
    return user.post(endpoints.generateOtp + `?phoneNumber=${phoneNumber}`, { headers: { Authorization: `Bearer ${token}` } })
}

export const verifyOtp = (token, data) => {
    return user.post(endpoints.generateOtp, data, { headers: { Authorization: `Bearer ${token}` } })
}

export const updateProfile = (token, data) => {
    return user.post(endpoints.updateProfile, data, { headers: { Authorization: `Bearer ${token}` } })
}