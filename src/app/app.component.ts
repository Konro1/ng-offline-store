import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from './user';
import {Store} from '@ngrx/store';
import {UserActions} from './actions/user.action';
import {HttpService} from './services/http.service';

export interface AppState {
    user: User;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

    title = 'app';

    usersStore: Observable<User>;

    firstName = 'first';
    lastName = 'last';

    constructor(private store: Store<AppState>, private userActions: UserActions, private httpService: HttpService) {
        this.usersStore = store.select('user');
    }

    ngOnInit(): void {
        const action = this.userActions.getUsers();
        this.httpService.makeRequest(this.usersStore, action)
    }

    add() {
        const action = this.userActions.addUser({
            firstName: this.firstName,
            lastName: this.lastName
        });

        this.httpService.makeRequest(this.usersStore, action)
    }
}
