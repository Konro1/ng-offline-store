import {ActionReducer, Action} from '@ngrx/store';

export const ADD = 'ADD';
export const GET = 'GET';

export interface User {
    firstName: string;
    lastName: string;
    date?: string;
    sync?: boolean;
}

const localUsers = JSON.parse(localStorage.getItem('users')) || [];
export function userReducer(state = localUsers, action: Action) {
    switch (action.type) {
        case ADD:

            const current = action.payload;
            current.date = Date.now();
            const newState = [
                ...state,
                Object.assign({}, current)
            ];

            localStorage.setItem('users', JSON.stringify(newState));

            return newState;

        case GET:
            const users = localStorage.getItem('users')
            const usersArr = JSON.parse(users);
            if (usersArr) {
                usersArr.forEach((index, user) => {
                    if (user['sync'] === true) {
                        usersArr.slice(index, 1);
                    }
                });
                localStorage.setItem('users', JSON.stringify(usersArr));
            }

            return state.concat(action.payload.users);

        default:
            return state;
    }
}


