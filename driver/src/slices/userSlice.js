import { configureStore, createSlice } from '@reduxjs/toolkit';
import { GetLocalStorage } from '../helpers/FunctionHelper';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userDetails: null,
        token: null
    },
    reducers: {
        setUserDetails: (state, action) => {
            state.userDetails = action.payload.user
        },
        setToken: (state, action) => {
            state.token = action.payload.token
        },
    },
});


// Action creators are generated for each case reducer function
export const { setUserDetails, setToken } = userSlice.actions
export const selectUserDetails = (state) => state.user.userDetails;
export const selectToken = (state) => state.user.token

export default userSlice.reducer;