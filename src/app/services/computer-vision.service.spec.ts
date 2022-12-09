import { TestBed, inject } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';

import { ComputerVisionService } from './computer-vision.service';

describe('ComputerVisionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [ComputerVisionService]
        });
    });

    it('should be created', inject([ComputerVisionService], (service: ComputerVisionService) => {
        expect(service).toBeTruthy();
    }));
});
