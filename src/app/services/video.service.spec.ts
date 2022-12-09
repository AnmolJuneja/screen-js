import { TestBed, inject } from '@angular/core/testing';

import { VideoService } from './video.service';

xdescribe('VideoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoService]
    });
  });

  it('should be created', inject([VideoService], (service: VideoService) => {
    expect(service).toBeTruthy();
  }));
});
