import {Injectable} from '@angular/core';
import {UserActions} from '../actions/user.action';
import {Actions, Effect} from '@ngrx/effects'
import {UserService} from '../services/user.service';
import {QueueService} from '../services/queue.service';
import {Observable} from 'rxjs/Observable';
import {UnsyncedAction} from '../interfaces/unsyncedAction';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';

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


    @Effect() addUser$ = this.update$
        .ofType(UserActions.ADD_USER_REQUEST)
        .mergeMap((action: UnsyncedAction) => {
                return this.userService.addUser(action.payload)
                    .map(result => ({
                        type: action.meta.commit.type,
                        payload: result
                    }))
                    .catch(error => {
                        const unsyncedAction = this.userActions.saveInQueueAction(this.userActions.addUser(action.payload));
                        this.queueService.saveActionInQue(unsyncedAction);

                        return Observable.of({
                            type: action.meta.rollback.type,
                            payload: action.meta.rollback.payload
                        });
                    })
            }
        );

    @Effect() addUserSync$ = this.update$
        .ofType(UserActions.ADD_USER_REQUEST_SYNC)
        .mergeMap((action: UnsyncedAction) => {
            return this.userService.syncUsers(action.payload)
                .map(result => ({
                    type: action.meta.commit.type,
                    payload: result
                }))
                .catch(error => {
                    const unsyncedAction = this.userActions.saveInQueueAction(this.userActions.addUser(action.payload));
                    this.queueService.saveActionInQue(unsyncedAction);

                    return Observable.of({
                        type: action.meta.rollback.type,
                        payload: action.meta.rollback.payload
                    });
                })
        })

    constructor(private update$: Actions,
                private userService: UserService,
                private queueService: QueueService,
                private userActions: UserActions) {
    }
}