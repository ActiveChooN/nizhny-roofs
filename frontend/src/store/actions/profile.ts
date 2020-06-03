import {AppThunk} from '../index';
import {getProfile as getProfileAPI, postAvatar as postAvatarAPI, patchProfile as patchProfileAPI} from '../../api/profile';
import {showMessage} from '../slices/alertMessage';
import {
    getProfileFailed,
    getProfileRequest,
    getProfileSuccess,
    updateProfileRequest,
    updateProfileFinished,
} from '../slices/profile';

export const getProfile = (): AppThunk => dispatch => {
    dispatch(getProfileRequest());
    getProfileAPI().then(profile => {
        dispatch(getProfileSuccess(profile));
    }).catch(e => {
        dispatch(getProfileFailed());
        dispatch(showMessage({
            message: e.message || 'Ошибка загрузки информации профиля',
        }))
    })
};

export const postAvatar = (file: File): AppThunk => dispatch => {
    postAvatarAPI(file).then(() => {
        dispatch(showMessage({
            message: 'Фотография профиля успешно обновленна',
            variant: 'success',
        }));
        dispatch(getProfile());
    }).catch(e => {
        dispatch(showMessage({
            message: e.message || 'Ошибка загрузки информации профиля',
        }))
    })
}

export const patchProfile = (email?: string, firstName?: string, lastName?: string): AppThunk => dispatch => {
    dispatch(updateProfileRequest());
    patchProfileAPI(email, firstName, lastName).then(profile => {
        dispatch(showMessage({
            message: 'Информация профиля успешно обновленна',
            variant: 'success',
        }));
        dispatch(updateProfileFinished());
        dispatch(getProfileSuccess(profile));
    }).catch(e => {
        dispatch(showMessage({
            message: e.message || 'Ошибка обновления информации профиля',
        }))
    })
}