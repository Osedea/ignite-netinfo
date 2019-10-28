import { createSlice } from 'redux-starter-kit';

interface NetworkState {
    connected: boolean,
}

const initialState: NetworkState = {
    connected: false,
};

const networkState = createSlice({
    slice: 'networkState',
    initialState,
    reducers: {
        connectivityChanged: (state, action) => {
            state.connected = action.payload;
        }
    },
});

export default networkState;
