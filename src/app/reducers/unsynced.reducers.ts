import {UnsyncedAction} from '../interfaces/unsyncedAction';
import {UnsyncedActions} from '../actions/unsynced.action';

declare let localforage: any;

export function unsyncedReducer(state = [], action: UnsyncedAction) {
    switch (action.type) {
        case UnsyncedActions.GET:
            // const items = localStorage.getItem('unsyncedActions');
            localforage.getItem('unsyncedActions')
                .then(unsyncedActions => {
                  console.log('reunsyncedActions',unsyncedActions);
                  if (unsyncedActions) {
                      return JSON.parse(unsyncedActions);
                  }

                  return state;
                })
                .catch(err => {
                  console.error(err);

                  return state;
                });

        default:

            return state;
    }
}
