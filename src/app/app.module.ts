import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {FormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {UserActions} from './actions/user.action';
import {HttpService} from './services/http.service';
import reducer from './reducers/index';
import {NetworkService} from './services/network.service';
import {QueueService} from './services/queue.service';
import {UnsyncedActions} from './actions/unsynced.action';
import {NgxBarcodeModule} from 'ngx-barcode';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import * as localforage from 'localforage';
import Quagga from 'quagga';
import {TestComponent} from './test.component';

export function initQueueService(queueService: QueueService): any {
    return () => {
        return queueService.load();
    }
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '-lang.json');
}

@NgModule({
    declarations: [
        AppComponent,
        TestComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StoreModule.provideStore( reducer ),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        NgxBarcodeModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [Http]
            }
        })
    ],
    providers: [
        { provide: 'localforage', useValue: localforage },
        { provide: 'Quagga', useValue: Quagga },
        UserActions,
        UnsyncedActions,
        HttpService,
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
