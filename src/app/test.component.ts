import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-test',
  template: `
    <div>Test component {{ 'HOME.TITLE' | translate }}</div>
  `
})

export class TestComponent {
  constructor(
    private translate: TranslateService
  ) {}
}
