import {UserActions} from '../actions/user.action';
import {Action} from '@ngrx/store';

declare let localforage: any;

export function userReducer(state = [], action: Action) {
    switch (action.type) {
        case 'ADD_USER_ERRORED':
            return [...state, action.payload];

        case UserActions.ADD_USER_COMMIT:
            return [...state, action.payload];

        case UserActions.ADD_USER_ROLLBACK:
            return [...state, action.payload];

        case UserActions.GET_USER_COMMIT:
            return state.concat(action.payload.users);

        case UserActions.DELETE_USER_COMMIT:
            const deleteCommitState = [];
            state.forEach(item => {
                if (item.localId !== action.payload.localId) {
                    deleteCommitState.push(item);
                }
            })
            return deleteCommitState;

        case UserActions.DELETE_USER_ROLLBACK:
            const deleteRollbackState = [];
            state.forEach(item => {
                if (item.localId !== action.payload.localId) {
                    deleteRollbackState.push(item);
                }
            })
            return deleteRollbackState;

        case UserActions.DELETE_USER_REQUEST_SYNC_COMMIT:
            const deleteSyncState = [];
            state.forEach(item => {
                action.payload.forEach(payload => {
                    if (item.localId !== payload.localId) {
                        deleteSyncState .push(item);
                    }
                })
            })
            return deleteSyncState;

        case UserActions.EDIT_USER_REQUEST_SYNC_COMMIT:
            const editSyncState = [];
            state.forEach((item, index) => {
                const edited = action.payload.find(payload => payload.localId === item.localId)
                console.log(state, edited);
                if (edited) {
                    editSyncState[index] = edited;
                } else {
                    editSyncState[index] = item;
                }
            })
            return editSyncState;

        case UserActions.GET_USER_ROLLBACK:
            localforage.getItem('users').then(users => {
                return users || state;
            })
            .catch(err => {
                return state;
            });

        default:
            return state;
    }
}
