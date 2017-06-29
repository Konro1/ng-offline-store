import {UserActions} from '../actions/user.action';

declare let localforage: any;

export function userReducer(state = [], action) {
    switch (action.type) {

        case UserActions.ADD_USER_COMMIT:
            let current = action.payload;
            current.sync = true;
            let newState = [
                ...state,
                Object.assign({}, current)
            ];

            /*localStorage.setItem('users', JSON.stringify(newState));*/

            console.log(localforage);
            localforage.setItem('users', JSON.stringify(newState), (err) => {
                console.error(err);
            });

            return newState;

        case UserActions.ADD_USER_ROLLBACK:
            current = action.payload;
            current.sync = false;
            newState = [
                ...state,
                Object.assign({}, current)
            ];

            /*localStorage.setItem('users', JSON.stringify(newState));*/

            localforage.setItem('users', JSON.stringify(newState), (err) => {
              console.error(err);
            });

            return newState;

        case UserActions.GET_USER_COMMIT:

            return state.concat(action.payload.users);

        case UserActions.GET_USER_ROLLBACK:
            /*const items = localStorage.getItem('users');*/

            localforage.getItem('users', (err, value) => {
              console.error(err);
              if (err) return state;
              console.error(value);
              return JSON.parse(value) || [];
            });
            /*if (items) {
                return JSON.parse(items);
            }

            return state;*/

        default:
            return state;
    }
}
