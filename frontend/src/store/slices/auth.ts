import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authenticated: false,
        authenticating: false,
        authToken: null,
        refreshToken: null,
    },
    reducers: {
        authenticationProccess(state) {
            return {
                ...state,
                authenticating: true,
            };
        },
        authenticationSucceed(state, action) {
            const {authToken, refreshToken} = action.payload;
            return {
                authenticated: true,
                authenticating: false,
                authToken,
                refreshToken,
            }
        },
        authenticationFailure(state) {
            return {
                ...state,
                authenticating: false,
            }
        },
        logout() {
            return {
                authenticated: false,
                authenticating: false,
                authToken: null,
                refreshToken: null,
            }
        }
    },
});

export const {
    authenticationProccess,
    authenticationSucceed,
    authenticationFailure,
    logout,
} = authSlice.actions;

export default authSlice.reducer;