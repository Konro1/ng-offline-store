import {Injectable} from '@angular/core';
import {NetworkService} from './network.service';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces/appstate';
import {UnsyncedActions} from '../actions/unsynced.action';

@Injectable()

export class QueueService {

    queue;
    private subscription = false;

    constructor(
        private store: Store<AppState>,
        private networkService: NetworkService,
        private unsyncedActions: UnsyncedActions
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

    public saveActionInQue(action) {
        const items = localStorage.getItem('unsyncedActions');
        let actionsArray = [];
        if (items) {
            actionsArray = JSON.parse(items);
            actionsArray.push(action);
        } else {
            actionsArray = [action];
        }

        localStorage.setItem('unsyncedActions', JSON.stringify(actionsArray));
    }

    private getStoredActions() {
        console.log('___getStoredActions___');
        const items = localStorage.getItem('unsyncedActions');
        if (items) {
            const actionsArray = JSON.parse(items);
            actionsArray.forEach(action => {
                setTimeout(() => {
                    this.store.dispatch(action);
                }, 100)
            });
        }
        //
        // // @todo FOR NOW CLEAR ALL IN FEATURE NEED TO DELETE ACTIONS FROM STORAGE AFTER SUCCESS REQUEST
        localStorage.removeItem('unsyncedActions')
    }
}
