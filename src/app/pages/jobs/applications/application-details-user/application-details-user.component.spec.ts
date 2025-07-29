import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDetailsUserComponent } from './application-details-user.component';

describe('ApplicationDetailsUserComponent', () => {
  let component: ApplicationDetailsUserComponent;
  let fixture: ComponentFixture<ApplicationDetailsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDetailsUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDetailsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
