import { TestBed } from '@angular/core/testing';

import { DashboardstatsService } from './dashboardstats.service';

describe('DashboardstatsService', () => {
  let service: DashboardstatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardstatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
