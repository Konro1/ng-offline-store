import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Store} from '@ngrx/store';
import {AppState} from 'app/app.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {ADD, GET} from '../user';

@Injectable()
export class UserService {

    private userStore;

    constructor(private http: Http, private store: Store<AppState>) {
        this.userStore = store.select('user');
    }

    addItem(item) {

        this.http.post('https://demo-redux-vadimn92.c9users.io/api/users', item)
            .catch(err => {
                item.sync = false;
                this.userStore.dispatch({type: ADD, payload: item});
                return Observable.throw(err);
            })
            .map(res => res.json())
            .map(payload => {

                payload.sync = true;

                return {
                    type: ADD, payload
                }
            })
            .subscribe(action => this.userStore.dispatch(action))
    }

    getItems() {
        this.http.get('https://demo-redux-vadimn92.c9users.io/api/users')
            .catch(err => {
                return Observable.throw(err)
            })
            .map(res => res.json())
            .map(payload => ({type: GET, payload}))
            .subscribe(action => {
                return this.userStore.dispatch(action)
            });
    }

}
