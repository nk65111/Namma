import { API_BASE_URL } from "../common/api.constant"
import fetch_ from "../helpers/axios-interceptor"

const { GET_KYC, UPDATE_BANK_DETAIL, UPDATE_VEHICLE_DETAIL, UPLOAD_LICENCE, UPLOAD_SELFIE } = API_BASE_URL;

export const DriverKycService = {
    uploadProfilePic: (selfie) => {
        return fetch_({
            url: UPLOAD_SELFIE(selfie),
            method: 'PUT',
            headers: {
                'content-type': 'multipart/form-data'
            },
        })
    },
    uploadLicence: (drivingLicenceImage) => {
        return fetch_({
            url: UPLOAD_LICENCE(drivingLicenceImage),
            method: 'PUT',
            headers: {
                'content-type': 'multipart/form-data'
            },
        })
    },
    updateBankDetail: (bankDetail) => {
        return fetch_({
            url: UPDATE_BANK_DETAIL,
            method: 'PUT',
            data: bankDetail,
            headers: {
                'Content-Type': 'application/json'
            },
        })
    },
    updateVehicleDetail: (vehicleDetail) => {
        return fetch_({
            url: UPDATE_VEHICLE_DETAIL,
            method: 'PUT',
            data: vehicleDetail,
            headers: {
                'Content-Type': 'application/json'
            },
        })
    },
    getKyc: () => {
        return fetch_({
            url: GET_KYC,
            method: 'GET',
        })
    }
}