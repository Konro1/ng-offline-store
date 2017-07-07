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
import {NgxBarcodeModule} from 'ngx-barcode';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {EffectsModule} from '@ngrx/effects';
import effects from './effects';
import {UserService} from './services/user.service';

import * as localforage from 'localforage';
import Quagga from 'quagga';
import {QRCodeModule} from 'angular2-qrcode';

import {TestComponent} from './test.component';
import {DictionaryService} from './services/dictionary.service';

// import {QrScannerModule} from 'angular2-qrscanner/dist';
import {UserEffects} from './effects/user';
import {QueueEffects} from './effects/queue';
import {StorageService} from './services/storage.service';

export function initQueueService(queueService: QueueService): any {
    return () => {
        return queueService.load();
    }
}

export function initDictionaryService(dictionaryService: DictionaryService): any {
  return () => {
    return dictionaryService.initDictionary();
  }
}

// AoT requires an exported function for factories
/*export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http,  'assets/i18n/', '-lang.json');
}*/

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
        TranslateModule.forRoot(),
        EffectsModule,
        EffectsModule.run(UserEffects),
        QRCodeModule,
        EffectsModule.run(QueueEffects),
    ],
    providers: [
        { provide: 'localforage', useValue: localforage },
        { provide: 'Quagga', useValue: Quagga },
        UserActions,
        HttpService,
        DictionaryService,
        UserService,
        NetworkService,
        StorageService,
        QueueService,
        {
            provide: APP_INITIALIZER,
            useFactory: initQueueService,
            deps: [QueueService],
            multi: true
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initDictionaryService,
          deps: [DictionaryService],
          multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
