import NetworkState from './reducer';
const { actions } = NetworkState;

export const connectivityChanged = (connected: boolean) => (dispatch) =>
    dispatch(actions.connectivityChanged(connected));
