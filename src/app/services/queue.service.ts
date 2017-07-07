import {Injectable} from '@angular/core';
import {NetworkService} from './network.service';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces/appstate';
import {ObjectHelper} from '../helpers/object.helper';

declare let localforage: any;

@Injectable()

export class QueueService {

    queue;
    private subscription = false;

    constructor(private store: Store<AppState>,
                private networkService: NetworkService) {
        if (!this.subscription) {
            this.networkService.status.subscribe(isOnline => {
                if (isOnline) {
                    this.processStoredActions()
                }
            })
            this.subscription = true;
        }
    }

    public load() {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    public saveActionInQue(action, type = 'ADD') {
        localforage.getItem('unsyncedActions').then(actions => {
            if (actions) {
                let storedToCreateItem = null;
                let storedToEditItem = null;

                switch (type) {
                    case 'EDIT':
                        storedToCreateItem = this.findStoredItem(actions, action.meta.createAction, action.payload)
                        if (storedToCreateItem) {
                            ObjectHelper.updateFromObject(storedToCreateItem, action.payload);
                        } else {
                            storedToEditItem = this.findStoredItem(actions, action.meta.editAction, action.payload);
                            if (storedToEditItem) {
                                ObjectHelper.updateFromObject(storedToEditItem, action.payload);
                            } else {
                                this.addOrUpdateAction(actions, action, action.meta.editAction);
                            }
                        }
                        break;

                    case 'DELETE':
                        storedToCreateItem = this.findStoredItem(actions, action.meta.createAction, action.payload)
                        storedToEditItem = this.findStoredItem(actions, action.meta.editAction, action.payload)
                        if (storedToCreateItem) {
                            const createActions = actions.find((stored) => stored.type === action.meta.createAction)
                            createActions.payload.forEach((ac, index) => {
                                if (ac.localId === action.payload.localId) {
                                    createActions.payload.splice(index, 1);
                                }
                            });
                            console.log(JSON.stringify(createActions.payload.length));
                            if (!createActions.payload.length) {
                                this.removeStoredActionByType(actions, action.meta.createAction);
                            }
                        }

                        if (storedToEditItem) {
                            const editActions = actions.find((stored) => stored.type === action.meta.editAction)
                            editActions.payload.forEach((ac, index) => {
                                if (ac.localId === action.payload.localId) {
                                    editActions.payload.splice(index, 1);
                                }
                            });
                            if (!editActions.payload.length) {
                                this.removeStoredActionByType(actions, action.meta.editAction);
                            }
                        }

                        if (!storedToCreateItem) {
                            this.addOrUpdateAction(actions, action, action.meta.deleteAction);
                        }
                        break;

                    case 'ADD':
                        actions.filter((item) => item.type === action.type)
                            .map(item => {
                                item.payload.push(action.payload);
                            })
                        break;
                }
            } else {
                action.payload = [action.payload];
                actions = [action];
            }
            localforage.setItem('unsyncedActions', actions);
        });
    }

    private findStoredItem(actions, type, payload) {
        const storedActions = actions.find((stored) => stored.type === type);
        if (storedActions) {
            return storedActions.payload.find(stored => stored.localId === payload.localId);
        }
    }

    private addOrUpdateAction(actions, action, type) {
        const storedActions = actions.find((stored) => stored.type === type);
        if (storedActions) {
            storedActions.payload.push(action.payload);
        } else {
            action.payload = [action.payload];
            actions.push(action);
        }
    }

    private removeStoredActionByType(actions, type) {
        actions.forEach((action, index) => {
            if (action.type === type) {
                actions.splice(index, 1);
            }
        })
    }

    private processStoredActions() {
        localforage.getItem('unsyncedActions').then(actions => {
            if (actions) {
                actions.forEach(action => {
                    this.store.dispatch(action);
                });
            }
        });

        // @todo FOR NOW CLEAR ALL, IN FEATURE NEED TO DELETE ACTIONS FROM STORAGE AFTER SUCCESS REQUEST
        localforage.removeItem('unsyncedActions');
    }
}
