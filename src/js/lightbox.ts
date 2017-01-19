import { Injectable } from '@angular/core';
import { LightboxConfig } from './lightbox-config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LightboxComponent } from './lightbox.component';

@Injectable()
export class Lightbox {
  constructor(private modalService: NgbModal) {}

  open(album: array, curIndex: number = 0, options: LightboxConfig = {}) {
    const modalRef = this.modalService.open(LightboxComponent);

    modalRef.componentInstance.album = album;
    modalRef.componentInstance.currentImageIndex = curIndex;
    modalRef.componentInstance.options = options;
    return modalRef;
  }
}
