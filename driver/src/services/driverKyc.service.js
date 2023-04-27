import { API_BASE_URL } from "../common/api.constant"
import fetch_ from "../helpers/axios-interceptor"

const { ADD_KYC, GET_KYC } = API_BASE_URL;

export const DriverKycService = {
    addKyc: (kyc) => {
        return fetch_({
            url: ADD_KYC,
            method: 'PUT',
            data: kyc,
            headers: {
                'content-type': 'multipart/form-data'
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