export const GOOGLE_MAP_API_KEY = 'RAAHI_API_KEY'

export const BASE_URL = 'http://10.0.2.2:8080/api/v1/customer'
// export const BASE_URL = 'http://localhost:8080/api/v1/customer'


export const endpoints = {
    generateOtp: '/generateOtp',
    verifyOtp: '/verifyOtp',
    profile: '/profile',
    updateProfile: '/update-profile',
    updateRide: '/ride/update-book',
    addRide: '/ride/book',
    getRides: '/ride/get-completed-ride',
    cancelRide: '/ride/delete-book'
}