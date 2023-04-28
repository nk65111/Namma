import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AuthService } from '../services';
import { AUTH_TOKEN_KEY, USER_INFO_KEY } from '../common/api.constant';
import { SetLocalStorage } from '../helpers/FunctionHelper';

export default function useSession() {
    const { userDetails } = useSelector(state => state.user);
    const [user, setUser] = useState({});

    useEffect((prev) => {
        setUser({ ...prev, userDetails });
    }, [userDetails])

    const setUser_ = (newCustomerData, accessToken) => {
        if (!newCustomerData) {
            AuthService.logOut();
        } else {
            if (accessToken) {
                SetLocalStorage(AUTH_TOKEN_KEY, accessToken)
            }
            SetLocalStorage(USER_INFO_KEY, newCustomerData)
        }
    }
    return [user, setUser_];
}
