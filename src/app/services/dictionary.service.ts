import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

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
      const currentLang = this.getCurrentLang();

      Promise.all([langs, currentLang])
        .then((res) => {
          let lang = res[1] || 'en';
          console.log('translate.currentLang', this.translate.currentLang);
          this.translate.addLangs(res[0]);
          this.translate.setDefaultLang(lang);
          const browserLang = this.translate.getBrowserLang();
          this.translate.use(browserLang.match(/en|fr|es/) ? lang : browserLang);
          this.getDictionary(lang)
            .then(dictionary => {
              this.translate.setTranslation(lang, dictionary);
              this.setDictionaryLocaly(lang, dictionary);

              resolve(true);
            });
        }).catch(err => {
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
      .map(res => res.json())
      .toPromise();
  }
}
