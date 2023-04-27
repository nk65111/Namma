import { APP_URL_ENV, BASE_URL_ENV, API_URL_ENV, API_BASE, GOOGLE_MAP_API_KEY_ENV } from "../env";

export const APP_URL = APP_URL_ENV;
export const BASE_URL = BASE_URL_ENV;
export const API_URL = API_URL_ENV;
export const API_BASE_PATH = API_BASE;
export const GOOGLE_MAP_API_KEY = GOOGLE_MAP_API_KEY_ENV;

export const endpoints = {
    generateOtp: '/generateOtp',
    verifyOtp: '/verifyOtp',
    profile: '/profile',
    updateProfile: '/update-profile',
}