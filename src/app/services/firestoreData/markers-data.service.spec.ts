import { TestBed } from '@angular/core/testing';

import { MarkersDataService } from './markers-data.service';

describe('MarkersDataService', () => {
  let service: MarkersDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
