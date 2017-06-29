import {Injectable} from '@angular/core';
import {NetworkService} from './network.service';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces/appstate';
import {UnsyncedActions} from '../actions/unsynced.action';
import {HttpService} from './http.service';

declare let localforage: any;

@Injectable()

export class QueueService {

    queue;
    private subscription = false;

    constructor(
        private store: Store<AppState>,
        private networkService: NetworkService,
        private unsyncedActions: UnsyncedActions,
        private httpService: HttpService
    ) {
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

    private getStoredActions() {
        console.log('___getStoredActions___');
        // const items = localStorage.getItem('unsyncedActions');
        // if (items) {
        //     const actionsArray = JSON.parse(items);
        //     actionsArray.forEach(action => {
        //         this.httpService.makeRequest(this.store, action);
        //     })
        // }

        localforage.getItem('unsyncedActions')
            .then(unsyncedActions => {
                const actionsArray = JSON.parse(unsyncedActions) || [];
                actionsArray.forEach(action => {
                    this.httpService.makeRequest(this.store, action);
                });
                localforage.removeItem('unsyncedActions');
            })
            .catch(err => {
                console.error(err);
                localforage.removeItem('unsyncedActions');
            })

        // @todo FOR NOW CLEAR ALL IN FEATURE NEED TO DELETE ACTIONS FROM STORAGE AFTER SUCCESS REQUEST
        //localStorage.removeItem('unsyncedActions');
    }
}
