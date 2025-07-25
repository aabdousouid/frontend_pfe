import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInterviewDetailsComponent } from './user-interview-details.component';

describe('UserInterviewDetailsComponent', () => {
  let component: UserInterviewDetailsComponent;
  let fixture: ComponentFixture<UserInterviewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInterviewDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInterviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
