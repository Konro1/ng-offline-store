import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from './user';
import {Store} from '@ngrx/store';
import {UserService} from './services/user.service';

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

    users: Observable<User>;

    firstName = 'first';
    lastName = 'last';

    constructor(private store: Store<AppState>, private userService: UserService) {
        this.users = store.select('user');
    }

    ngOnInit(): void {
        this.userService.getItems();
    }

    add() {
        this.userService.addItem({firstName: this.firstName, lastName: this.lastName});
    }
}
