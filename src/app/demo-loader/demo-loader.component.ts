import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-demo-loader',
    templateUrl: './demo-loader.component.html',
    styleUrls: ['./demo-loader.component.css']
})
export class DemoLoaderComponent implements OnInit {

    // sample values for loader
    screenId: string = 'screen_8ca8700e-1ec9-4735-8515-2286eae4b1b7';

    // sample values for loader
    dateTime: string = '2018-09-12T00:00:00Z';

    imageUrl: string = 'https://media.stage.addulate.com/account_00000000-0000-4000-b000-000000000000/image_ec79e428-e552-4ac4-8c2e-720548121deb.jpg';

    constructor() {
        console.log('demoLoader loaded');
    }

    ngOnInit() {
    }

}
