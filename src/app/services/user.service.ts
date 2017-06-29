import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../interfaces/user';
import {Store} from '@ngrx/store';
import {AppState} from '../interfaces/appstate';

@Injectable()
export class UserService {

    private BASE_URL = 'https://demo-redux-vadimn92.c9users.io';

    constructor (private http: Http, private store: Store<AppState>) {}

    getUsers(): Observable<User[]> {
        return this.http.get(this.BASE_URL + '/api/users')
            .map(res => res.json());
    }

    getUser(id): Observable<User> {
        return this.http.get('/api/users/' + id)
            .map(res => res.json());
    }

    addUser(user) {
        return this.http.post(this.BASE_URL + '/api/users', user)
            .map(res => res.json());
    }

    deleteUser(hero) {
        return this.http.delete(this.BASE_URL + '/api/users/' + hero.id)
            .map(res => hero);
    }
}
