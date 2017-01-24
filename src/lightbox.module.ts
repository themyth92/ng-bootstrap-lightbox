import { BrowserModule } from '@angular/platform-browser';
import { Lightbox } from './lightbox';
import { LightboxComponent } from './lightbox.component';
import { LightboxConfig } from './lightbox-config';
import { LightboxContentComponent } from './lightbox-content.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ LightboxComponent, LightboxContentComponent ],
  providers: [
    Lightbox,
    LightboxConfig,
    { provide: 'Window', useValue: window }
  ],
  imports: [ NgbModule.forRoot() ],
  exports: [ LightboxComponent ],
  entryComponents: [ LightboxContentComponent ]
})
export class LightboxModule { }
