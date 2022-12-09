import { TestBed, inject } from '@angular/core/testing';

import { BroadcastService } from './broadcast.service';

xdescribe('BroadcastService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BroadcastService]
        });
    });

    it('should be created', inject([BroadcastService], (service: BroadcastService) => {
        expect(service).toBeTruthy();
    }));
});
