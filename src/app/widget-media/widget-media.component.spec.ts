import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMediaComponent } from './widget-media.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { VgCoreModule } from 'videogular2/compiled/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import { VgBufferingModule } from 'videogular2/compiled/buffering';
import { NGXLogger, NGXMapperService, NGXLoggerHttpService, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WidgetMediaComponent', () => {
    let component: WidgetMediaComponent;
    let fixture: ComponentFixture<WidgetMediaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WidgetMediaComponent],
            imports: [
                LoggerModule.forRoot({
                    serverLoggingUrl: '/api/logs',
                    level: NgxLoggerLevel.DEBUG,
                    serverLogLevel: NgxLoggerLevel.OFF
                }),
                BrowserAnimationsModule,
                TranslateModule.forRoot(),
                HttpClientModule,
                VgCoreModule,
                VgControlsModule,
                VgOverlayPlayModule,
                VgBufferingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetMediaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
