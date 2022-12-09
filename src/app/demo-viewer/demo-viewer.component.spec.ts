import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { NGXLoggerMock } from 'ngx-logger/testing';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { DemoViewerComponent } from './demo-viewer.component';
import { DemoMediaComponent } from '../demo-media/demo-media.component';
import { VideoMediaComponent } from '../video-media/video-media.component';
import { SafePipe } from '../safe.pipe';

xdescribe('DemoViewerComponent', () => {
    let component: DemoViewerComponent;
    let fixture: ComponentFixture<DemoViewerComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DemoViewerComponent,
                DemoMediaComponent,
                VideoMediaComponent,
                SafePipe
            ],
            imports: [
                TranslateModule,
                HttpClientTestingModule,
                LoggerTestingModule
            ],
            providers: [
                TranslateService,
                TranslateStore,
                { provide: NGXLogger, useClass: NGXLoggerMock },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        httpTestingController = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(DemoViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
