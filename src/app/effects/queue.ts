import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {QueueService} from '../services/queue.service';
import {QueuedActions} from '../actions/queued.actions';
import {Observable} from 'rxjs/Observable';
import {UserActions} from '../actions/user.action';

declare let localforage: any;

@Injectable()
export class QueueEffects {
    // @Effect() getQueuedItems = this.update$.ofType(QueuedActions.GET_FROM_QUEUE)
    //     .mergeMap(action => {
    //         console.log(action);
    //         return this.queueService.getQueuedItems(UserActions.ADD_USER_REQUEST_SYNC)
    //             .then(res => ({
    //                 type: QueuedActions.GET_FROM_QUEUE_COMMIT,
    //                 payload: res,
    //             }));
    //     });

    @Effect() deleteQueuedItem = this.update$.ofType(QueuedActions.DELETE_FROM_QUEUE)
        .mergeMap(action => {
            localforage.getItem('unsyncedActions').then(actions => {
                const storedAction = actions.find((foundAction) => foundAction.type === action.payload.type);
                storedAction.payload.forEach((value, index) => {
                    if (value.localId === action.payload.localId) {
                        storedAction.payload.splice(index, 1);
                    }
                });
                localforage.setItem('unsyncedActions', actions);
            })
            return Observable.of({type: 'asdasd'});
        });

    constructor(private update$: Actions, private queueService: QueueService) {
    }
}
