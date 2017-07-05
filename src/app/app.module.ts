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
import {NgxBarcodeModule} from 'ngx-barcode';


import * as localforage from 'localforage';
import Quagga from 'quagga';
import {QRCodeModule} from 'angular2-qrcode';


import {TestComponent} from './test.component';
// import {QrScannerModule} from 'angular2-qrscanner/dist';

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
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        NgxBarcodeModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [Http]
            }
        }),
        EffectsModule,
        EffectsModule.run(UserEffects),
        QRCodeModule
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
