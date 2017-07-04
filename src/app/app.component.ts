import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {UserActions} from './actions/user.action';
import {NetworkService} from './services/network.service';
import {AppState} from './interfaces/appstate';
import {User} from './interfaces/user';
import {TranslateService} from '@ngx-translate/core';

declare let Quagga: any;

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

    constructor(
        private store: Store<AppState>,
        private userActions: UserActions,
        private networkService: NetworkService,
        private translate: TranslateService) {
        this.usersStore = store.select('user');
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
            firstName: this.firstName,
            lastName: this.lastName,
            date: Date.now()
        });

        this.store.dispatch(action);
    }
}
