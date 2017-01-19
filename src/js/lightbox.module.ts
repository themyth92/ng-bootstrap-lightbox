import { BrowserModule } from '@angular/platform-browser';
import { Lightbox } from './lightbox';
import { LightboxComponent } from './lightbox.component';
import { LightboxConfig } from './lightbox-config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ LightboxComponent ],
  providers: [ Lightbox ],
  imports: [ NgbModule.forRoot() ],
  entryComponents: [ LightboxComponent ]
})
export class LightboxModule { }
