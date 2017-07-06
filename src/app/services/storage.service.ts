import {Injectable} from '@angular/core';

declare let localforage: any;

@Injectable()

export class StorageService {

    public addItemToStorage(storage, item) {
        return localforage.getItem(storage).then(items => {
            items = items || [];
            items.push(item);

            localforage.setItem(storage, items);
        })
    }

    public updateStorage(storage, items) {
        return localforage.setItem(storage, items);
    }
}
