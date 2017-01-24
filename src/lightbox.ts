import { Injectable } from '@angular/core';
import { LightboxConfig } from './lightbox-config';
import { LightboxContentComponent } from './lightbox-content.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class Lightbox {
  constructor(private _modalService: NgbModal, private _config: LightboxConfig) {}

  open(album: array, curIndex: number = 0, options: LightboxConfig = {}) {
    const modalRef = this._modalService.open(LightboxContentComponent, { windowClass: 'lb-modal-window' });
    const newOptions = {};

    modalRef.componentInstance.album = album;
    modalRef.componentInstance.currentImageIndex = curIndex;
    Object.assign(newOptions, this._config, options);
    modalRef.componentInstance.options = newOptions;
    return modalRef;
  }
}
