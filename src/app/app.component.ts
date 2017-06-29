import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {UserActions} from './actions/user.action';
import {NetworkService} from './services/network.service';
import {AppState} from './interfaces/appstate';
import {User} from './interfaces/user';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    public usersStore: Observable<User>;
    public firstName = 'error';
    public lastName = 'last';
    public networkStatus;

    constructor(private store: Store<AppState>, private userActions: UserActions, private networkService: NetworkService) {
        this.usersStore = store.select('user');
        networkService.status.subscribe((isOnline: boolean) => this.networkStatus = isOnline);
    }

    ngOnInit(): void {
        const action = this.userActions.getUsers();
        this.store.dispatch(action);
    }

    add() {
        const action = this.userActions.addUser({
            firstName: this.firstName,
            lastName: this.lastName,
            date: Date.now()
        });

        this.store.dispatch(action);
    }
}
