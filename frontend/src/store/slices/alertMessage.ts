import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Color} from '@material-ui/lab/Alert/Alert'
import {SnackbarOrigin} from '@material-ui/core/Snackbar/Snackbar'

import {AppThunk} from "../index";

interface AlertMessageState {
    message: string,
    autoHideDuration: number,
    anchorOrigin: SnackbarOrigin,
    variant: Color,
    isOpened: boolean,
}

interface ShowMessageActionPayload {
    message: string,
    autoHideDuration?: number,
    anchorOrigin?: SnackbarOrigin,
    variant?: Color,
}

const alertMessageInitialState: AlertMessageState = {
    message: '',
    autoHideDuration: 6000,
    anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
            },
    variant: 'error',
    isOpened: false,
};

const alertMessageSlice = createSlice({
    name: 'alertMessage',
    initialState: alertMessageInitialState,
    reducers: {
        showMessage: (state, action: PayloadAction<ShowMessageActionPayload>) => {
            return {
                ...state,
                ...action.payload,
                isOpened: true
            };
        },
        hideMessage: state => {
            state.isOpened = false;
        }
    }
})

export const {
    showMessage,
    hideMessage,
} = alertMessageSlice.actions;

export const showErrorSuccessMessageOnFetch = (p: Promise<any>, successMessage?: string | null | false, errorMessage?: string)
    : AppThunk => dispatch => {
        p.then((obj: any) => successMessage !== false && dispatch(showMessage({
                message: successMessage || obj?.message || 'Action success',
                variant: 'success'})))
            .catch((e: any) => dispatch(showMessage({
                message: errorMessage || e?.message || 'Action failed'})))
}

export default alertMessageSlice.reducer;