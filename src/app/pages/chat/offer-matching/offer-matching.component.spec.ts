import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferMatchingComponent } from './offer-matching.component';

describe('OfferMatchingComponent', () => {
  let component: OfferMatchingComponent;
  let fixture: ComponentFixture<OfferMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferMatchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
