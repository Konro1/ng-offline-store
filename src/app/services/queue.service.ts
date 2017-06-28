import {Injectable} from '@angular/core';
import {NetworkService} from './network.service';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces/appstate';
import {UnsyncedActions} from '../actions/unsynced.action';
import {HttpService} from './http.service';

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
            this.queue = store.select('unsyncedActions');
            this.queue.dispatch(this.unsyncedActions.getActions());

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
        this.queue.forEach(actions => {
            actions.forEach(action => {
                this.httpService.makeRequest(this.store, action)
            })
        })

        // @todo FOR NOW CLEAR ALL IN FEATURE NEED TO DELETE ACTIONS FROM STORAGE AFTER SUCCESS REQUEST
        localStorage.removeItem('unsyncedActions')
    }
}
