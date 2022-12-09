import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BroadcastLoaderComponent } from './broadcast-loader.component';
import { BroadcastViewerComponent } from '../broadcast-viewer/broadcast-viewer.component';
import { BroadcastService } from '../services/broadcast.service';
import { AnalyticsService } from '../services/analytics.service';
xdescribe('BroadcastLoaderComponent', () => {
    let component: BroadcastLoaderComponent;
    let fixture: ComponentFixture<BroadcastLoaderComponent>;
    let fakeBroadcastService: any;
    let fakeActivatedRoute: any;
    let fakeAnalyticsService: any;

    beforeEach(async(() => {
        fakeBroadcastService = jasmine.createSpyObj('BroadcastService', ['getBrowserLang']);
        fakeActivatedRoute = undefined;
        fakeAnalyticsService = undefined;

        TestBed.configureTestingModule({
            declarations: [
                BroadcastLoaderComponent,
                BroadcastViewerComponent
            ],
            providers: [
                { provide: BroadcastService, useValue: fakeBroadcastService },
                { provide: ActivatedRoute, useValue: fakeActivatedRoute },
                { provide: AnalyticsService, useValue: fakeAnalyticsService }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BroadcastLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
