import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProfessionalComponent } from './dashboard-professional.component';

describe('DashboardProfessionalComponent', () => {
  let component: DashboardProfessionalComponent;
  let fixture: ComponentFixture<DashboardProfessionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardProfessionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
