import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsListUserComponent } from './complaints-list-user.component';

describe('ComplaintsListUserComponent', () => {
  let component: ComplaintsListUserComponent;
  let fixture: ComponentFixture<ComplaintsListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintsListUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintsListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
