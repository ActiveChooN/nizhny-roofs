import {combineReducers} from 'redux';
import alertMessageReducer from './slices/alertMessage';
import roofsReducer from './slices/roofs';

export default combineReducers({
    alertMessage: alertMessageReducer,
    roofs: roofsReducer,
});