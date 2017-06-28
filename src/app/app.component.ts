import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from './user';
import {Store} from '@ngrx/store';
import {UserActions} from './actions/user.action';
import {HttpService} from './services/http.service';

declare let localforage: any;

export interface AppState {
    user: User;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

    usersStore: Observable<User>;

    firstName = 'first';
    lastName = 'last';

    constructor(private store: Store<AppState>, private userActions: UserActions, private httpService: HttpService) {
        this.usersStore = store.select('user');
    }

    ngOnInit(): void {
        const action = this.userActions.getUsers();
        this.httpService.makeRequest(this.usersStore, action);
      localforage.setItem('key', 'value').then(function () {
        return localforage.getItem('key');
      }).then(function (value) {
        console.log(value);
      }).catch(function (err) {
        console.error(err);
      });
    }

    add() {
        const action = this.userActions.addUser({
            firstName: this.firstName,
            lastName: this.lastName,
            date: Date.now()
        });

        this.httpService.makeRequest(this.usersStore, action)
    }
}
