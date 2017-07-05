import {Injectable} from '@angular/core';
import {NetworkService} from './network.service';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces/appstate';

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
                switch (type) {
                    case 'EDIT':
                        actions.forEach(storedAction => {
                            const stored = storedAction.payload.find(inQueue => inQueue.localId === action.payload.localId);
                            if (stored) {
                                for(const val in action.payload) {
                                    stored[val] = action.payload[val];
                                }
                                console.log(stored, actions);
                            } else {

                                // TODO FIX THIS
                                actions.filter((item) => item.type === action.type)
                                    .map(storedAction => {
                                        storedAction.payload.forEach((value, index) => {
                                            if (value.localId === action.payload.localId) {
                                                storedAction.payload[index] = action.payload;
                                            } else {
                                                storedAction.payload.push(action.payload);
                                            }
                                        })
                                    })
                            }
                        })
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
