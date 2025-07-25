import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInterviewsComponent } from './user-interviews.component';

describe('UserInterviewsComponent', () => {
  let component: UserInterviewsComponent;
  let fixture: ComponentFixture<UserInterviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInterviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
