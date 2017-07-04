import {UserActions} from '../actions/user.action';
import {Action} from '@ngrx/store';

export function userReducer(state = [], action: Action) {
    switch (action.type) {

        case 'ADD_USER_ERRORED':
            return [...state, action.payload];

        case UserActions.ADD_USER_COMMIT:
console.log(action.payload);
            return [...state, action.payload];

        case UserActions.ADD_USER_ROLLBACK:

            return [...state, action.payload];

        case UserActions.GET_USER_COMMIT:

            return state.concat(action.payload.users);

        case UserActions.GET_USER_ROLLBACK:
            const items = localStorage.getItem('users');
            if (items) {
                return JSON.parse(items);
            }
            console.log('I am here');

            return state;

        default:
            return state;
    }
}
