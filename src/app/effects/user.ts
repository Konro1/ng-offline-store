import {Injectable} from '@angular/core';
import {UserActions} from '../actions/user.action';
import {Actions, Effect} from '@ngrx/effects'
import {UserService} from '../services/user.service';
import {QueueService} from '../services/queue.service';
import {Observable} from 'rxjs/Observable';
import {UnsyncedAction} from '../interfaces/unsyncedAction';
import {QueuedActions} from '../actions/queued.actions';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import {StorageService} from '../services/storage.service';

@Injectable()
export class UserEffects {

    @Effect() getUsers$ = this.update$
        .ofType(UserActions.GET_USER_REQUEST)
        .switchMap((action: UnsyncedAction) => {
            return this.userService.getUsers()
                .map(res => ({
                    type: action.meta.commit.type,
                    payload: res,
                }))
                .catch(error => {
                    return Observable.of({
                        type: action.meta.rollback.type,
                        payload: action.meta.rollback.payload
                    })
                })
        });
    @Effect() getUsersCommit$ = this.update$
        .ofType(UserActions.GET_USER_COMMIT)
        .mergeMap(action => {
            this.storageService.updateStorage('users', action.payload.users);

            return Observable.of({type: 'SAVED'});
        })

    @Effect() addUser$ = this.update$
        .ofType(UserActions.ADD_USER_REQUEST)
        .mergeMap((action: UnsyncedAction) => {
                return this.userService.addUser(action.payload)
                    .map(result => ({
                        type: action.meta.commit.type,
                        payload: result
                    }))
                    .catch(error => {
                        return this.rollback(action);
                    })
            }
        );

    @Effect() addUserSync$ = this.update$
        .ofType(UserActions.ADD_USER_REQUEST_SYNC)
        .mergeMap((action: UnsyncedAction) => {
            return this.userService.syncUsers(action.payload)
                .mergeMap(result => {
                    return Observable.of({
                        type: QueuedActions.DELETE_FROM_QUEUE_COMMIT,
                        payload: result
                    });
                })
                .catch(error => {
                    return this.rollback(action);
                })
        })

    @Effect() editUser$ = this.update$
        .ofType(UserActions.EDIT_USER_REQUEST)
        .mergeMap(action => {
            return this.userService.editUser(action.payload)
                .map(res => ({
                    type: action.meta.commit.type,
                    payload: action.meta.commit.payload
                }))
                .catch(error => {
                    return this.rollback(action, 'EDIT');
                });

        });

    @Effect() deleteUser$ = this.update$
        .ofType(UserActions.DELETE_USER_REQUEST)
        .mergeMap(action => {
            return this.userService.deleteUser(action.payload)
                .map(res => ({
                    type: action.meta.commit.type,
                    payload: action.meta.commit.payload
                }))
                .catch(error => {
                    return this.rollback(action, 'DELETE');
                });
        })

    @Effect() deleteUserSync$ = this.update$
        .ofType(UserActions.DELETE_USER_REQUEST_SYNC)
        .mergeMap((action: UnsyncedAction) => {
            return this.userService.syncUsersDelete(action.payload)
                .mergeMap(result => {
                    return Observable.of({
                        type: QueuedActions.DELETE_FROM_QUEUE_COMMIT,
                        payload: result
                    }, {
                        type: UserActions.DELETE_USER_REQUEST_SYNC_COMMIT,
                        payload: action.payload,
                    });
                })
                .catch(error => {
                    return this.rollback(action);
                })
        })

    @Effect() editUserSync$ = this.update$
        .ofType(UserActions.EDIT_USER_REQUEST_SYNC)
        .mergeMap((action: UnsyncedAction) => {
            return this.userService.syncUsersEdit(action.payload)
                .mergeMap(result => {
                    return Observable.of({
                        type: QueuedActions.DELETE_FROM_QUEUE_COMMIT,
                        payload: result
                    }, {
                        type: UserActions.EDIT_USER_REQUEST_SYNC_COMMIT,
                        payload: action.payload,
                    });
                })
                .catch(error => {
                    return this.rollback(action);
                })
        })

    private rollback(action, actionType = 'ADD') {
        const unsyncedAction = this.userActions.saveInQueueAction(action);
        this.queueService.saveActionInQue(unsyncedAction, actionType);

        return Observable.of(
            {
                type: action.meta.rollback.type,
                payload: action.meta.rollback.payload
            });
    }

    constructor(private update$: Actions,
                private userService: UserService,
                private queueService: QueueService,
                private userActions: UserActions,
                private storageService: StorageService) {
    }
}
