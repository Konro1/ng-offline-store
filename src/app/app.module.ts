import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {UserActions} from './actions/user.action';
import {userReducer} from './reducers/user.reducers';
import {HttpService} from './services/http.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StoreModule.provideStore({ user: userReducer }),
        StoreDevtoolsModule.instrumentOnlyWithExtension()
    ],
    providers: [UserActions, HttpService],
    bootstrap: [AppComponent]
})
export class AppModule {}
