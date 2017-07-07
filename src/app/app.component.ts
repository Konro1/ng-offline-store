import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {UserActions} from './actions/user.action';
import {NetworkService} from './services/network.service';
import {AppState} from './interfaces/appstate';
import {User} from './interfaces/user';
import {TranslateService} from '@ngx-translate/core';

declare let Quagga: any;
declare let QRCode: any;
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

    constructor(private store: Store<AppState>,
                private userActions: UserActions,
                private networkService: NetworkService,
                private translate: TranslateService) {
        this.usersStore = store.select('user');
        this.queueStore = store.select('queueStore');
        networkService.status.subscribe((isOnline: boolean) => this.networkStatus = isOnline);
    }

    ngOnInit(): void {
        const action = this.userActions.getUsers();
        this.networkService.status.subscribe(isOnline => {
            this.networkStatus = isOnline
        });

        this.store.dispatch(action);
        /*Quagga.init({
         inputStream : {
         name : "Live",
         type : "LiveStream",
         target: document.querySelector('#yourElement')    // Or '#yourElement' (optional)
         },
         decoder : {
         readers : ["code_128_reader"]
         }
         }, function(err) {
         if (err) {
         console.log(err);
         return
         }
         console.log("Initialization finished. Ready to start");
         Quagga.start();
         });

         this.initQuagga();*/
        // this. initQRCode();
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

    initQuagga() {
        Quagga.init({
            inputStream: {
                name: 'Live',
                type: 'LiveStream',
                target: document.querySelector('#yourElement')    // Or '#yourElement' (optional)
            },
            decoder: {
                readers: ['code_128_reader']
            }
        }, function (err) {
            if (err) {
                console.log(err);
                return
            }
            console.log('Initialization finished. Ready to start');
        });
    }

    initQRCode() {
        const qrcode = new QRCode(document.getElementById('qrcode'), 'http://jindo.dev.naver.com/collie');
    }

    decodedOutput(event) {
        console.log(event);
    }

    startQuagga() {
        console.log('startQuagga');
        Quagga.start();
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

  openBarcodeImage() {
    Quagga.decodeSingle({
      src: '../assets/images/test.png',
      numOfWorkers: 0,  // Needs to be 0 when used within node
      inputStream: {
        size: 800  // restrict input-size to be 800px in width (long-side)
      },
      decoder: {
        readers: ['code_128_reader'] // List of active readers
      },
    }, function(result) {
      if (result.codeResult) {
        alert(result.codeResult.code);
      } else {
        alert('not detected');
      }
    });
  }

  openQRCode() {
      /*console.log(Instascan);
    const scanner = new Instascan.Scanner({ video: document.getElementById('yourElement') });
    scanner.addListener('scan', function (content) {
      console.log(content);
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      if (cameras.length > 0) {
        scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });*/
  }

  openBarcode() {
    Quagga.decoder({readers: ['code_128_reader']})
      .locator({patchSize: 'medium'})
      .fromVideo({
        target: document.querySelector('#yourElement'),
        constraints: {
          width: 800,
          height: 600,
          facingMode: "environment"
        }
      });
  }
}
