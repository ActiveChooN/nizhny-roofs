import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Alert from "@material-ui/lab/Alert/Alert";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

import {RootState} from '../../store';
import {hideMessage} from '../../store/slices/alertMessage';

export default function AlertProvider(props: React.PropsWithChildren<React.ReactNode>): JSX.Element {
    const {
        anchorOrigin,
        autoHideDuration,
        isOpened,
        message,
        variant,
    } = useSelector((state: RootState) => state.alertMessage);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideMessage())
    }

    return (
        <>
            {props.children}
            <Snackbar anchorOrigin={anchorOrigin} autoHideDuration={autoHideDuration} open={isOpened} onClose={handleClose}>
                <Alert severity={variant} onClose={handleClose}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}