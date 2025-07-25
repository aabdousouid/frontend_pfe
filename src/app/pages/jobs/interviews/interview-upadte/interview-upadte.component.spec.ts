import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewUpadteComponent } from './interview-upadte.component';

describe('InterviewUpadteComponent', () => {
  let component: InterviewUpadteComponent;
  let fixture: ComponentFixture<InterviewUpadteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewUpadteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewUpadteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
