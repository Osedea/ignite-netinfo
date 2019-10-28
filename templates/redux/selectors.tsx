import NetworkState from '../reducer';
import { createSelector } from 'redux-starter-kit';

export const selectConnected = () => createSelector(
    ['Network'],
    (networkState) => networkState.connected
);
