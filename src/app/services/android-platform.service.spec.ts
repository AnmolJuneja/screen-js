import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { NGXLoggerMock } from 'ngx-logger/testing';
import { AndroidPlatformService } from './android-platform.service';

describe('AndroidPlatformService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            LoggerTestingModule
        ],
        providers: [
            AndroidPlatformService,
            { provide: NGXLogger, useClass: NGXLoggerMock },
        ]
    }));

    it('should be created', () => {
        const service: AndroidPlatformService = TestBed.get(AndroidPlatformService);
        expect(service).toBeTruthy();
    });
});
