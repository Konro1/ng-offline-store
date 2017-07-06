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
                    this.getStoredActions()
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

    public saveActionInQue(action) {
        localforage.getItem('unsyncedActions').then(items => {
            let actionsArray = [];
            if (items) {
                actionsArray = JSON.parse(items);
                actionsArray
                    .filter((item) => item.type === action.type)
                    .map(item => {
                        item.payload.push(action.payload);
                    })
            } else {
                action.payload = [action.payload];
                actionsArray = [action];
            }
            localforage.setItem('unsyncedActions', JSON.stringify(actionsArray));
        });
    }

    private getStoredActions() {
        console.log('___getStoredActions___');

        localforage.getItem('unsyncedActions').then(items => {
            if (items) {
                const actionsArray = JSON.parse(items);
                actionsArray.forEach(action => {
                    this.store.dispatch(action);
                });
            }
        });

        // @todo FOR NOW CLEAR ALL, IN FEATURE NEED TO DELETE ACTIONS FROM STORAGE AFTER SUCCESS REQUEST
        localforage.removeItem('unsyncedActions');
    }
}
