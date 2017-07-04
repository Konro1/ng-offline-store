export class QueuedActions {

    static SAVE_IN_QUEUE_ACTION = 'SAVE_IN_QUEUE_ACTION';

    public saveInQueueAction(action) {

        return {
            type: action.type + '_SYNC',
            payload: action.payload,
            meta: action.meta,
        }
    }
}
