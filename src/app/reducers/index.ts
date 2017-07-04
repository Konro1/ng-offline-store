import {combineReducers} from '@ngrx/store';
import {userReducer} from './user.reducers';

export default combineReducers({
    user: userReducer
})
