import {User} from './user';
import {UnsyncedActions} from '../actions/unsynced.action';

export interface AppState {
    user: User;
    unsyncedActions: UnsyncedActions
}
