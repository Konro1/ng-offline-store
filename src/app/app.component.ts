import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from './user';
import {Store} from '@ngrx/store';
import {UserActions} from './actions/user.action';
import {HttpService} from './services/http.service';
import {NetworkService} from './services/network.service';
import {AppState} from './interfaces/appstate.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

    public usersStore: Observable<User>;
    public firstName = 'first';
    public lastName = 'last';
    public networkStatus;

    constructor(private store: Store<AppState>, private userActions: UserActions, private httpService: HttpService,
                private networkService: NetworkService) {
        this.usersStore = store.select('user');
    }

    ngOnInit(): void {
        const action = this.userActions.getUsers();
        this.httpService.makeRequest(this.usersStore, action)
        this.networkService.status.subscribe(isOnline => {this.networkStatus = isOnline})
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
