import { PUBLIC_REQUEST_KEY, API_BASE_URL } from "../common/api.constant"
import fetch_ from "../helpers/axios-interceptor"

const { VERIFY_OTP, SEND_OTP, LOGOUT } = API_BASE_URL;

export const AuthService = {
    sendOtp: (phoneNumber) => {
        return fetch_({
            url: SEND_OTP(phoneNumber),
            method: 'POST',
            headers: {
                [PUBLIC_REQUEST_KEY]: true
            }
        })
    },
    verifyOtp: ({ phoneNumber, otp }) => {
        return fetch_({
            url: VERIFY_OTP,
            method: 'POST',
            headers: {
                [PUBLIC_REQUEST_KEY]: true,
                'Content-Type': 'application/json'
            },
            data: {
                phoneNumber: phoneNumber,
                otp: otp
            }
        })
    },
    logOut: () => {
        return fetch_({
            url: LOGOUT,
            method: 'POST',
        })
    },
}