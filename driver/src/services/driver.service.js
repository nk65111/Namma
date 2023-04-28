import { API_BASE_URL } from "../common/api.constant"
import fetch_ from "../helpers/axios-interceptor"

const { DELETE_PROFILE, RIDE_HISTORY, UPDATE_LOCATION, UPDATE_PROFILE, USER_PROFILE } = API_BASE_URL;

export const DriverService = {
    updateProfile: (user) => {
        return fetch_({
            url: UPDATE_PROFILE,
            method: 'PUT',
            data: user
        })
    },
    getMyProfile: () => {
        return fetch_({
            url: USER_PROFILE,
            method: 'GET',
        })
    },
    rideHistory: () => {
        return fetch_({
            url: RIDE_HISTORY,
            method: 'GET',
        })
    },
    deleteProfile: () => {
        return fetch_({
            url: DELETE_PROFILE,
            method: 'DELETE',
        })
    },
    updateLocation: (data) => {
        return fetch_({
            url: UPDATE_LOCATION,
            method: 'PUT',
            data: data
        })
    }
}