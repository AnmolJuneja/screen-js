import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { NGXLoggerMock } from 'ngx-logger/testing';

import { DemoLoaderComponent } from './demo-loader.component';
import { DemoViewerComponent } from '../demo-viewer/demo-viewer.component';
import { DemoMediaComponent } from '../demo-media/demo-media.component';
import { VideoMediaComponent } from '../video-media/video-media.component';
import { UrlMediaComponent } from '../url-media/url-media.component';

import { SafePipe } from '../safe.pipe';

xdescribe('DemoLoaderComponent', () => {
    let component: DemoLoaderComponent;
    let fixture: ComponentFixture<DemoLoaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DemoLoaderComponent,
                DemoViewerComponent,
                DemoMediaComponent,
                VideoMediaComponent,
                UrlMediaComponent,
                SafePipe,
            ],
            imports: [
                LoggerTestingModule
            ],
            providers: [
                { provide: NGXLogger, useClass: NGXLoggerMock },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DemoLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
