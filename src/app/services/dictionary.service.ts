import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/forkJoin';

declare let localforage: any;

@Injectable()

export class DictionaryService {
  constructor(
    private http: Http,
    private translate: TranslateService
  ) {}


  initDictionary() {
    this.subscribeChangeLang();
    return new Promise((resolve, reject) => {
      const langs = this.getLangs();
      const currentLang = Observable.fromPromise(this.getCurrentLang());

      Observable.forkJoin(langs, currentLang)
        .subscribe(res => {
          const lang = res[1] || 'en';
          this.translate.addLangs(res[0]);
          this.translate.setDefaultLang(lang.toString());
          const browserLang = this.translate.getBrowserLang();
          this.translate.use(browserLang.match(/en|fr|es/) ? lang.toString() : browserLang);
          this.getDictionary(lang)
            .then(dictionary => {
              this.translate.setTranslation('en', dictionary);
              this.setDictionaryLocaly(lang, dictionary);

              resolve(true);
            });
        }, err => {
          this.getDictionaryLocaly()
            .then(res => {
              this.translate.addLangs([res['lang']]);
              this.translate.setDefaultLang(res['lang']);
              this.translate.use(res['lang']);
              this.translate.setTranslation(res['lang'], res['dictionary']);
              resolve(true);
            })
        });
    });
  }

  subscribeChangeLang() {
    this.translate.onLangChange.subscribe((event) => {
      this.getDictionary(event['lang'])
        .then(res => {
          this.translate.setTranslation(event['lang'], res);
          this.setDictionaryLocaly(event['lang'], res);
          this.setCurrentLang(event['lang']);
        });
    });
  }

  getDictionary(lang) {
    const url = 'http://demo-redux-vadimn92.c9users.io/i18n/' + lang + '-lang.json';
    return this.http.get(url)
      .map((res) => res.json())
      .toPromise();
  }
  getCurrentLang() {
    return localforage.getItem('lang');
  }
  setCurrentLang(lang) {
    localforage.setItem('lang', lang);
  }
  getDictionaryLocaly() {
    return localforage.getItem('dictionary');
  }
  setDictionaryLocaly(lang, dictionary) {
    localforage.setItem('dictionary', {lang : lang, dictionary : dictionary});
  }
  getLangs() {
    return this.http.get('http://demo-redux-vadimn92.c9users.io/langs')
      .map(res => res.json());
  }
}
