import {UnsyncedAction} from '../interfaces/unsyncedAction';
import {UnsyncedActions} from '../actions/unsynced.action';

export function unsyncedReducer(state = [], action: UnsyncedAction) {
    switch (action.type) {
        case UnsyncedActions.GET:
            const items = localStorage.getItem('unsyncedActions');
            if (items) {

                return JSON.parse(items);
            }

            return state;
        default:

            return state;
    }
}
