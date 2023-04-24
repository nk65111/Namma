import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userDetails: null,
    token: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.userDetails = action.payload.user
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUserDetails, setToken } = userSlice.actions

export const selectUserDetails = (state) => state.user.userDetails;
export const selectToken = (state) => state.user.token

export default userSlice.reducer