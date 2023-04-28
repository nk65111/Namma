// UI
export const ENTRY_ROUTE = 'Signin'
export const TOKEN_PAYLOAD_KEY = 'authorization'
export const PUBLIC_REQUEST_KEY = 'public-request'

export const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';
export const USER_INFO_KEY = 'DRIVER_DATA';
export const DEVICE_TOKEN = 'DEVICE_TOKEN';

export const API_BASE_URL = {
    //Auth
    SEND_OTP: (phoneNumber) => `/driver/generateOtp?phoneNumber=${phoneNumber}`,
    VERIFY_OTP: '/driver/verifyOtp',
    LOGOUT: '/driver/logout',

    //Driver
    USER_PROFILE: '/driver/current-user',
    UPDATE_PROFILE: `/driver/update-profile`,
    DELETE_PROFILE: `/driver/delete-profile`,
    UPDATE_LOCATION: `/driver/update-location`,
    RIDE_HISTORY: `/driver/ride/history-ride`,

    // Driver kyc
    ADD_KYC: `/driver/kyc`,
    GET_KYC: `/driver/kyc`,
    UPLOAD_LICENCE: (drivingLicenceImage) => `driver/upload-licence?drivingLicenceImage=${drivingLicenceImage}`,
    UPDATE_BANK_DETAIL: `/driver/upload-bankdetails`,
    UPDATE_VEHICLE_DETAIL: `/driver/upload-vehicledetails`,
    UPLOAD_SELFIE: (selfie) => `/driver/upload-selfie?selfie=${selfie}`,

    //Wallet
    ADD_MONEY: (wallerId) => `/wallet/add/${wallerId}`,
    TRANSFER_MONEY: (sourceWalletId, destinationWalletId) => `/wallet/transfer/${sourceWalletId}/${destinationWalletId}`,
    MY_WALLET: `/wallet/my-wallet`

}