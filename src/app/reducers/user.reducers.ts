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

        case UserActions.GET_USER_ROLLBACK:
            localforage.getItem('users').then(users => {
                return JSON.parse(users) || state;
            })
            .catch(err => {
                return state;
            });
            break;

        default:
            return state;
    }
}
