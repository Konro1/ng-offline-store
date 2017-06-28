import {Injectable} from '@angular/core';

Injectable()
export class UnsyncedActions {

    static GET = 'GET';
    static STORE = 'STORE';

    getActions() {
        return {
            type: UnsyncedActions.GET
        }
    }

    storeActions() {
        return {
            type: UnsyncedActions.STORE
        }
    }

}
