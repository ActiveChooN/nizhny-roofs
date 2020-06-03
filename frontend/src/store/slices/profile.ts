import {createSlice} from "@reduxjs/toolkit";

// import {AppThunk} from '../index';
// import {getProfile as getProfileAPI} from '../../api/profile';
// import {showMessage} from './alertMessage';

interface ProfileState {
    profile: {
        email: string,
        first_name: string,
        last_name: string,
        avatar: string,
    } | null,
    isLoading: boolean,
    isLoaded: boolean,
    isUpdating: boolean,
}

const ProfileInitialState: ProfileState = {
    profile: null,
    isLoaded: false,
    isLoading: false,
    isUpdating: false,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState: ProfileInitialState,
    reducers: {
        getProfileRequest: state => {
            return {
                ...state,
                isLoading: true
            };
        },
        getProfileFailed: state => {
            return {
                ...state,
                isLoading: false,
                isLoaded: false,
            };
        },
        getProfileSuccess: (state, action) => {
            return {
                ...state,
                profile: action.payload,
                isLoaded: true,
                isLoading: false,
            };
        },
        updateProfileRequest: state => {
            return {
                ...state,
                isUpdating: true,
            };
        },
        updateProfileFinished: state => {
            return {
                ...state,
                isUpdating: false,
            }
        }
    },
});

export const {
    getProfileRequest,
    getProfileFailed,
    getProfileSuccess,
    updateProfileRequest,
    updateProfileFinished,
} = profileSlice.actions;

export default profileSlice.reducer;