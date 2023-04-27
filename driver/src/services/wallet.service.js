import { API_BASE_URL } from "../common/api.constant"
import fetch_ from "../helpers/axios-interceptor"

const { ADD_MONEY, MY_WALLET, TRANSFER_MONEY } = API_BASE_URL;

export const WalletService = {
    addMoney: (walletId, amount) => {
        return fetch_({
            url: ADD_MONEY(walletId),
            method: 'POST',
            amount: amount,
            headers: {
                'content-type': 'multipart/form-data'
            },
        })
    },
    getKyc: () => {
        return fetch_({
            url: MY_WALLET,
            method: 'GET',
        })
    },
    transferMoney: (sourceId, destinationId, amount) => {
        return fetch_({
            url: TRANSFER_MONEY(sourceId, destinationId, amount),
            method: 'PUT',
            amount: amount,
            headers: {
                'content-type': 'multipart/form-data'
            },
        })
    }
}