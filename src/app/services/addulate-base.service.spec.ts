import { TestBed, inject } from '@angular/core/testing';

import { AddulateBaseService } from './addulate-base.service';

describe('AddulateBaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddulateBaseService]
    });
  });

  it('should be created', inject([AddulateBaseService], (service: AddulateBaseService) => {
    expect(service).toBeTruthy();
  }));
});
