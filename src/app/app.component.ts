import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {UserActions} from './actions/user.action';
import {NetworkService} from './services/network.service';
import {AppState} from './interfaces/appstate';
import {User} from './interfaces/user';
import {TranslateService} from '@ngx-translate/core';
import {QueuedActions} from "app/actions/queued.actions";

declare let Quagga: any;
declare let localforage: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    public value = Date.now();

    public usersStore: Observable<User>;
    public firstName = 'first';
    public lastName = 'last';
    public networkStatus;
    public queueStore: Observable<User>;
    public userEdit;

    constructor(
        private store: Store<AppState>,
        private userActions: UserActions,
        private networkService: NetworkService,
        private translate: TranslateService) {
        this.usersStore = store.select('user');
        this.queueStore = store.select('queueStore');
        networkService.status.subscribe((isOnline: boolean) => this.networkStatus = isOnline);

        translate.addLangs(['en', 'fr', 'es']);
        translate.setDefaultLang('en');

        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr|es/) ? browserLang : 'en');
    }

    ngOnInit(): void {
        const action = this.userActions.getUsers();
        this.store.dispatch(action);
    }

    add() {
        const action = this.userActions.addUser({
            localId: Date.now(),
            firstName: this.firstName,
            lastName: this.lastName,
            date: Date.now()
        });

        this.store.dispatch(action);
    }

    showEditUser(user: User) {
        this.userEdit = user;
    }

    closeEdit() {
        this.userEdit = null;
    }

    editUser(user: User) {
        const action = this.userActions.editUser(user);
        this.store.dispatch(action);
    }

    deleteUser(user: User) {
        const action = this.userActions.deleteUser(user);
        this.store.dispatch(action);
    }

    removeQueuedUser(localId) {
        this.store.dispatch(this.userActions.getDeleteFromQueue({
            localId: localId,
            type: UserActions.ADD_USER_REQUEST_SYNC
        }));
    }
}
