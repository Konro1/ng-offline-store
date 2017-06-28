import {Injectable} from '@angular/core';
import {NetworkService} from './network.service';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces/appstate.interface';

@Injectable()

export class QueueService {

    constructor(private store: Store<AppState>, private networkService: NetworkService) {
        this.networkService.status.subscribe(isOnline => {
            if (isOnline) {
                console.log('here');
            }
        })
    }

    public load() {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

}
