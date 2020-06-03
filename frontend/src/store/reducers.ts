import {combineReducers} from 'redux';
import alertMessageReducer from './slices/alertMessage';
import roofsReducer from './slices/roofs';
import profileReducer from './slices/profile'

export default combineReducers({
    alertMessage: alertMessageReducer,
    roofs: roofsReducer,
    profile: profileReducer,
});