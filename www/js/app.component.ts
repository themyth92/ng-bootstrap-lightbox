import { Component } from '@angular/core';
import { Album } from './album.service';
import { Lightbox } from 'lightbox';

@Component({
  selector: 'demo',
  template: `
    <template ngbModalContainer></template>
    <div class="row text-center">
      <div *ngFor="let image of albums; let i=index" class="img-row">
        <img class="img-responsive img-frame" [src]="image.thumb" (click)="open(i)"/>
      </div>
    </div>
  `
})
export class AppComponent {
  albums: Album[] = [];
  options: Object;
  constructor(private lightboxService: Lightbox) {
    for (let i = 1; i <= 4; i++) {
      const src = 'www/img/image' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';
      const thumb = 'www/img/image' + i + '-thumb.jpg';
      const album =  new Album(src, caption, thumb);

      this.albums.push(album);
    }
  }

  open(index) {
    this.lightboxService.open(this.albums, index, this.options);
  }
}