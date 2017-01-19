import { Component, ElementRef, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lightbox',
  /*template: `<div id="lightbox" class="lightbox" (click)="close($event)"">
    <div class="lb-outerContainer">
      <div class="lb-container">
        <img [src]="content.src" class="lb-image" [hidden]="ui.showReloader">
        <div class="lb-nav" [hidden]='ui.showReloader || !ui.showArrow'>
          <a class="lb-prev" href=""></a>
          <a class="lb-next" href=""></a>
        </div>
        <div class="lb-loader" [hidden]='!ui.showReloader'>
          <a class="lb-cancel"></a>
        </div>
      </div>
    </div>
    <div class="lb-dataContainer">
      <div class="lb-data">
        <div class="lb-details">
          <span class="lb-caption" style="display: inline;"></span>
          <span class="lb-number"></span>
        </div>
        <div class="lb-closeContainer">
          <a class="lb-close"></a>
        </div>
      </div>
    </div>
  </div>`*/
  template: `<div>Hello world</div>`
})
export class LightboxComponent {
  @Input() album;
  @Input() currentImageIndex;
  @Input() options;
  constructor(private activeModal: NgbActiveModal) {}
}