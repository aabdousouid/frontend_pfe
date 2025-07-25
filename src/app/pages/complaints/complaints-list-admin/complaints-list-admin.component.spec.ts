import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsListAdminComponent } from './complaints-list-admin.component';

describe('ComplaintsListAdminComponent', () => {
  let component: ComplaintsListAdminComponent;
  let fixture: ComponentFixture<ComplaintsListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintsListAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintsListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
