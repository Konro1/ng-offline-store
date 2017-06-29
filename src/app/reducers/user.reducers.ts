import {UserActions} from '../actions/user.action';
import {Inject} from '@angular/core';
import { Observable } from "rxjs";

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

            localforage.setItem('users', JSON.stringify(newState), function (err) {
              if(err) Observable.throw(err);
            });
            /*localStorage.setItem('users', JSON.stringify(newState));*/

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
            //const storedItems = localStorage.getItem('unsyncedActions');

            // localforage.getItem('unsyncedActions', (err, storedItems) => {
            //   if (err) {
            //
            //   }
            //
            //   if (storedItems) {
            //       const stored = JSON.parse(storedItems);
            //       stored.push(unsyncedAction);
            //       localStorage.setItem('unsyncedActions', JSON.stringify(stored));
            //   } else {
            //       localStorage.setItem('unsyncedActions', JSON.stringify([unsyncedAction]));
            //   }
            // });


            localforage.getItem('unsyncedActions')
                .then(storedItems => {
                  let stored = JSON.parse(storedItems) || [];
                  stored.push(unsyncedAction);
                  localforage.setItem('unsyncedActions', JSON.stringify(stored))
                })
                .catch(err => {
                  console.error(err);
                });


            return newState;

        case UserActions.GET_USER_COMMIT:

            return state.concat(action.payload.users);

        case UserActions.GET_USER_ROLLBACK:
            // const items = localStorage.getItem('users');
            // if (items) {
            //     return JSON.parse(items);
            // }
            //
            // return state;

            localforage.getItem('users')
                .then(users => {
                    return JSON.parse(users) || state;
                })
                .cache(err => {
                    return state;
                })

        default:
            return state;
    }
}
