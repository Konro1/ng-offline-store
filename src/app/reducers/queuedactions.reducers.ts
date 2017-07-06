import {Action} from '@ngrx/store';
import {QueuedActions} from '../actions/queued.actions';

export function queuedActionsReducer(state = [], action: Action) {
    switch (action.type) {

        case QueuedActions.SAVE_IN_QUEUE:
            return state.concat(action.payload);

        case QueuedActions.GET_FROM_QUEUE_COMMIT:
            return state.concat(action.payload);

        case QueuedActions.DELETE_FROM_QUEUE:
            const deletedState = []
            state.forEach(item => {
                if (item.localId !== action.payload.localId) {
                    deletedState.push(item);
                }
            })
            return deletedState;

        case QueuedActions.DELETE_FROM_QUEUE_COMMIT:
            const deletedCommitState = []
            if (action.payload && state) {
                action.payload.forEach(synced => {
                    state.forEach(item => {
                        if (item.localId !== synced.localId) {
                            deletedCommitState.push(item);
                        }
                    })
                })
            }

            return deletedCommitState;

        default:
            return state;
    }
}
