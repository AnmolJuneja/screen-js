import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaylistInsert]',
})
export class PlaylistInsertDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
