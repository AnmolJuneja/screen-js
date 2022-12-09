import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appBroadcastInsert]'
})
export class BroadcastInsertDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }

}
