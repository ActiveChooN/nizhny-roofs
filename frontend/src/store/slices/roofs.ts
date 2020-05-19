import {createSlice} from "@reduxjs/toolkit";

interface RoofComment {
    author_name: string,
    author_avatar: string,
    rating: number,
    text: string,
}

interface Roof {
    id: string,
    name: string,
    description: string,
    rating: number,
    lat: number,
    lng: number,
    comments: RoofComment[],
}

interface RoofsState {
    roofs: Roof[],
    isLoading: boolean,
    isLoaded: boolean,
}

const RoofsInitialState: RoofsState = {
    roofs: [],
    isLoaded: false,
    isLoading: false,
};

const roofsSlice = createSlice({
    name: 'roofs',
    initialState: RoofsInitialState,
    reducers: {
        getRoofsRequest: state => {
            return {
                ...state,
                isLoading: true
            };
        },
        getRoofsFailed: state => {
            return {
                ...state,
                isLoading: false,
                isLoaded: false,
            };
        },
        getRoofsSuccess: (state, action) => {
            return {
                roofs: action.payload.roofs,
                isLoaded: true,
                isLoading: false,
            };
        }
    }
});

export const {
    getRoofsRequest,
    getRoofsFailed,
    getRoofsSuccess,
} = roofsSlice.actions;

export default roofsSlice.reducer;