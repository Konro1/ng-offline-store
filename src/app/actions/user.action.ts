import {Injectable} from '@angular/core';
import {User} from '../interfaces/user';
import {QueuedActions} from './queued.actions';

@Injectable()

export class UserActions extends QueuedActions {

    static ADD_USER_REQUEST = 'ADD_USER_REQUEST';
    static ADD_USER_REQUEST_SYNC = 'ADD_USER_REQUEST_SYNC';
    static ADD_USER_COMMIT = 'ADD_USER_COMMIT';
    static ADD_USER_ROLLBACK = 'ADD_USER_ROLLBACK';

    static GET_USER_REQUEST = 'GET_USER_REQUEST';
    static GET_USER_COMMIT = 'GET_USER_COMMIT';
    static GET_USER_ROLLBACK = 'GET_USER_ROLLBACK';

    static EDIT_USER_REQUEST = 'EDIT_USER_REQUEST';
    static EDIT_USER_COMMIT = 'EDIT_USER_COMMIT';
    static EDIT_USER_ROLLBACK = 'EDIT_USER_ROLLBACK';
    static EDIT_USER_REQUEST_SYNC = 'EDIT_USER_REQUEST_SYNC';
    static EDIT_USER_REQUEST_SYNC_COMMIT = 'EDIT_USER_REQUEST_SYNC_COMMIT';

    static DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
    static DELETE_USER_COMMIT = 'DELETE_USER_COMMIT';
    static DELETE_USER_ROLLBACK = 'DELETE_USER_ROLLBACK';
    static DELETE_USER_REQUEST_SYNC = 'DELETE_USER_REQUEST_SYNC';
    static DELETE_USER_REQUEST_SYNC_COMMIT = 'DELETE_USER_REQUEST_SYNC_COMMIT';

    public static getAddUserAction(user) {
        return {
            type: UserActions.ADD_USER_REQUEST,
            payload: user,
            meta: {
                // the network action to execute:
                effect: {url: '/api/users', method: 'POST', body: user},
                // action to dispatch when effect succeeds:
                commit: {type: UserActions.ADD_USER_COMMIT, payload: user},
                // action to dispatch if network action fails permanently:
                rollback: {type: UserActions.ADD_USER_ROLLBACK, payload: user}
            }
        };
    }

    public addUser(user: User) {
        return {
            type: UserActions.ADD_USER_REQUEST,
            payload: user,
            meta: {
                // the network action to execute:
                effect: {url: '/api/users', method: 'POST', body: user},
                // action to dispatch when effect succeeds:
                commit: {type: UserActions.ADD_USER_COMMIT, payload: user},
                // action to dispatch if network action fails permanently:
                rollback: {type: UserActions.ADD_USER_ROLLBACK, payload: user},

                createAction: UserActions.ADD_USER_REQUEST_SYNC,
                editAction: UserActions.EDIT_USER_REQUEST_SYNC,
                deleteAction: UserActions.DELETE_USER_REQUEST_SYNC,
            }
        };
    };

    public getUsers() {
        return {
            type: UserActions.GET_USER_REQUEST,
            meta: {
                // the network action to execute:
                effect: {url: '/api/users', method: 'GET'},
                // action to dispatch when effect succeeds:
                commit: {type: UserActions.GET_USER_COMMIT},
                // action to dispatch if network action fails permanently:
                rollback: {type: UserActions.GET_USER_ROLLBACK}
            }
        };
    };

    public loadUserSuccess(users) {
        return {
            type: UserActions.GET_USER_COMMIT,
            payload: users
        };
    }

    public editUser(user: User) {
        return {
            type: UserActions.EDIT_USER_REQUEST,
            payload: user,
            meta: {
                // the network action to execute:
                effect: {url: '/api/users/' + user.localId, method: 'PUT', body: user},
                // action to dispatch when effect succeeds:
                commit: {type: UserActions.EDIT_USER_COMMIT, payload: user},
                // action to dispatch if network action fails permanently:
                rollback: {type: UserActions.EDIT_USER_ROLLBACK, payload: user},

                createAction: UserActions.ADD_USER_REQUEST_SYNC,
                editAction: UserActions.EDIT_USER_REQUEST_SYNC,
                deleteAction: UserActions.DELETE_USER_REQUEST_SYNC,
            }
        };
    }

    public deleteUser(user: User) {
        return {
            type: UserActions.DELETE_USER_REQUEST,
            payload: user,
            meta: {
                // the network action to execute:
                effect: {url: '/api/users/' + user.localId, method: 'DELETE', body: user},
                // action to dispatch when effect succeeds:
                commit: {type: UserActions.DELETE_USER_COMMIT, payload: user},
                // action to dispatch if network action fails permanently:
                rollback: {type: UserActions.DELETE_USER_ROLLBACK, payload: user},

                createAction: UserActions.ADD_USER_REQUEST_SYNC,
                editAction: UserActions.EDIT_USER_REQUEST_SYNC,
                deleteAction: UserActions.DELETE_USER_REQUEST_SYNC,
            }
        }
    }

    public addUserSuccess(user) {
        return {
            type: UserActions.ADD_USER_COMMIT,
            payload: user
        };
    }
}

