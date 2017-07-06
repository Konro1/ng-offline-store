import {combineReducers} from '@ngrx/store';
import {userReducer} from './user.reducers';
import {queuedActionsReducer} from './queuedactions.reducers';

export default combineReducers({
    user: userReducer,
    queueStore: queuedActionsReducer
})
