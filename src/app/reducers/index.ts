import {combineReducers} from '@ngrx/store';
import {userReducer} from './user.reducers';
import {unsyncedReducer} from './unsynced.reducers';

export default combineReducers({
    user: userReducer,
    unsyncedActions: unsyncedReducer
})
