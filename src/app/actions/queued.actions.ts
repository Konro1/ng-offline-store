export class QueuedActions {

    static SAVE_IN_QUEUE_ACTION = 'SAVE_IN_QUEUE_ACTION';
    static DELETE_FROM_QUEUE = 'DELETE_FROM_QUEUE';
    static DELETE_FROM_QUEUE_COMMIT = 'DELETE_FROM_QUEUE_COMMIT';
    static GET_FROM_QUEUE = 'GET_FROM_QUEUE';
    static GET_FROM_QUEUE_COMMIT = 'GET_FROM_QUEUE_COMMIT';

    public saveInQueueAction(action) {

        return {
            type: action.type + '_SYNC',
            payload: action.payload,
            meta: action.meta,
        }
    }

    public getDeleteFromQueue(payload) {
        return {
            type: QueuedActions.DELETE_FROM_QUEUE,
            payload: payload,
        }
    }
}
