import axios from 'axios'
import { API_BASE_PATH, API_URL } from '../common/config'
import { AUTH_TOKEN_KEY, ENTRY_ROUTE, PUBLIC_REQUEST_KEY, TOKEN_PAYLOAD_KEY, API_BASE_URL } from '../common/api.constant';
import { GetLocalStorage, showToast } from '../helpers/FunctionHelper';
import * as RootNavigation from '../helpers/RootNavigation';

const fetch_ = axios.create({
    baseURL: `${API_URL}${API_BASE_PATH}`,
    timeout: 60000
})

// API Request interceptor
fetch_.interceptors.request.use(async config => {
    console.log("__config__", config)
    const jwtToken = await GetLocalStorage(AUTH_TOKEN_KEY)

    if (jwtToken) {
        config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${jwtToken}`;
    }

    if (!jwtToken && !config.headers[PUBLIC_REQUEST_KEY]) {
        RootNavigation.navigate(ENTRY_ROUTE);
    }

    return config
}, error => {
    console.log(error, "111111111");
    showToast("Error")
    Promise.reject(error)
})

// API respone interceptor
fetch_.interceptors.response.use((response) => {

    const data = response.data;
    if (data.message) {
        showToast(data.message);
    }
    console.log("interceptor", data)
    return data;

}, (error) => {
    console.log(error, "OOOOOOOOOO");
    const { data = {}, status, statusText } = error?.response || {};
    data.description = data.message || statusText;
    data.message = data.error || statusText;
    data.statusCode = data.statusCode || status;

    if (
        [401, 403].includes(data.statusCode) &&
        ![
            API_BASE_URL.LOGIN,
            API_BASE_URL.SEND_OTP,
        ].includes(error.response?.config?.url)
    ) {
        // RemoveLocalStorage(AUTH_TOKEN_KEY)
        // RootNavigation.navigate(ENTRY_ROUTE);
    }

    showToast(`${data.description}`);
    return Promise.reject(data);
});

export default fetch_