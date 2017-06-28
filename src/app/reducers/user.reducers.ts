import {UserActions} from '../actions/user.action';
import {Inject} from '@angular/core';


export function userReducer(state = [], action) {
    switch (action.type) {

        case UserActions.ADD_USER_COMMIT:
            let current = action.payload;
            current.sync = true;
            let newState = [
                ...state,
                Object.assign({}, current)
            ];

            localStorage.setItem('users', JSON.stringify(newState));

            return newState;

        case UserActions.ADD_USER_ROLLBACK:
            current = action.payload;
            current.sync = false;
            newState = [
                ...state,
                Object.assign({}, current)
            ];

            // localStorage.setItem('users', JSON.stringify(newState));

            const unsyncedAction = UserActions.getAddUserAction(action.payload);
            const storedItems = localStorage.getItem('unsyncedActions');
            if (storedItems) {
                const stored = JSON.parse(storedItems);
                stored.push(unsyncedAction);
                localStorage.setItem('unsyncedActions', JSON.stringify(stored));
            } else {
                localStorage.setItem('unsyncedActions', JSON.stringify([unsyncedAction]));
            }

            return newState;

        case UserActions.GET_USER_COMMIT:

            return state.concat(action.payload.users);

        case UserActions.GET_USER_ROLLBACK:
            const items = localStorage.getItem('users');
            if (items) {
                return JSON.parse(items);
            }

            return state;

        default:
            return state;
    }
}
