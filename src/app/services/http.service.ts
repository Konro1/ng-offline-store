import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpService {

    private BASE_URL = 'https://demo-redux-vadimn92.c9users.io';

    constructor(private http: Http) {
    }

    public makeRequest(store, action) {

        const options = {
            method: action.meta.effect.method,
            body: action.meta.effect.body,
        };

        this.http.request(this.BASE_URL + action.meta.effect.url, options)
            .catch(err => {
                // @todo check error type
                store.dispatch({type: action.meta.rollback.type, payload: action.meta.rollback.payload});

                return Observable.throw(err);
            })
            .map(res => res.json())
            .map(payload => {

                return {
                    type: action.meta.commit.type, payload
                }
            })
            .subscribe(action => store.dispatch(action))
    }
}
