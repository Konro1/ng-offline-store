import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {UserActions} from './actions/user.action';
import {HttpService} from './services/http.service';
import reducer from './reducers/index';
import {NetworkService} from './services/network.service';
import {QueueService} from './services/queue.service';
import {UnsyncedActions} from './actions/unsynced.action';
import {EffectsModule} from '@ngrx/effects';
import {UserEffects} from './effects/user';
import {UserService} from './services/user.service';

export function initQueueService(queueService: QueueService): any {
    return () => {
        return queueService.load();
    }
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StoreModule.provideStore( reducer ),
        EffectsModule,
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        EffectsModule.run(UserEffects)
    ],
    providers: [
        UserActions,
        UnsyncedActions,
        HttpService,
        UserService,
        NetworkService,
        QueueService,
        {
            provide: APP_INITIALIZER,
            useFactory: initQueueService,
            deps: [QueueService],
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
