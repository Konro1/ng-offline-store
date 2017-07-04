import {Injectable} from '@angular/core';
import {UserActions} from '../actions/user.action';
import {Actions, Effect} from '@ngrx/effects'
import 'rxjs/add/operator/switchMap';
import {UserService} from '../services/user.service';
import {QueueService} from '../services/queue.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class UserEffects {

    @Effect() getUsers$ = this.update$
        .ofType(UserActions.GET_USER_REQUEST)
        .switchMap(() => {
            return this.userService.getUsers()
                .map(res => ({
                    type: UserActions.GET_USER_COMMIT,
                    payload: res,
                }))
                .catch(error => {
                    return Observable.of({
                        type: UserActions.GET_USER_ROLLBACK
                    })
                })
        });


    @Effect() addUser$ = this.update$
        .ofType(UserActions.ADD_USER_REQUEST)
        .mergeMap(action => {
                return this.userService.addUser(action.payload)
                    .map(res => ({
                        type: UserActions.ADD_USER_COMMIT,
                        payload: res
                    }))
                    .catch(error => {
                        const unsyncedAction = this.userActions.saveInQueueAction(this.userActions.addUser(action.payload));
                        this.queueService.saveActionInQue(unsyncedAction);
                        const rollbackAction = {
                            type: UserActions.ADD_USER_ROLLBACK,
                            payload: action.payload
                        }
                        return Observable.of(rollbackAction);
                    })
            }
        );

    @Effect() addUserSync$ = this.update$
        .ofType(UserActions.ADD_USER_REQUEST_SYNC)
        .mergeMap(action => {
            return this.userService.syncUsers(action.payload)
                .map(res => ({
                    type: UserActions.ADD_USER_COMMIT,
                    payload: res
                }))
                .catch(error => {
                    const unsyncedAction = this.userActions.saveInQueueAction(this.userActions.addUser(action.payload));
                    this.queueService.saveActionInQue(unsyncedAction);
                    const rollbackAction = {
                        type: UserActions.ADD_USER_ROLLBACK,
                        payload: action.payload
                    }
                    return Observable.of(rollbackAction);
                })
        })

    constructor(private update$: Actions,
                private userService: UserService,
                private queueService: QueueService,
                private userActions: UserActions) {
    }
}
