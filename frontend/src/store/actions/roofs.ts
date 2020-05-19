import {AppThunk} from '../index';
import {getRoofs as getRoofsAPI} from '../../api/roofs';
import {showMessage} from '../slices/alertMessage';
import {
    getRoofsRequest,
    getRoofsSuccess,
    getRoofsFailed,
} from '../slices/roofs';

export const getRoofs = (): AppThunk => dispatch => {
    dispatch(getRoofsRequest());
    getRoofsAPI().then(r => {
        dispatch(getRoofsSuccess(r));
    }).catch(e => {
        dispatch(getRoofsFailed());
        dispatch(showMessage(e.message));
    })
};