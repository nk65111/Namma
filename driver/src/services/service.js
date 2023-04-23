import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, endpoints } from "./config";

import axios from "axios"

const user = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + await AsyncStorage.getItem("raahi_token")?.then(res => res)
    }
})
console.log(token)
export const sendOtp = (data) => {
    return user.post(endpoints.sendOTP, data)
}