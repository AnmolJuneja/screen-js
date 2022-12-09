import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
    selector: 'app-demo-metadata',
    templateUrl: './demo-metadata.component.html',
    styleUrls: ['./demo-metadata.component.css']
})
export class DemoMetadataComponent implements OnInit {

    @Input()
    face: any;

    @Input()
    public canvas: ElementRef;

    left: 300;
    bottom: 400;

    AgeRange: string = 'AgeRange';
    Low: string = 'Low';
    High: string = 'High';

    constructor() { }

    ngOnInit() {

    }

}
