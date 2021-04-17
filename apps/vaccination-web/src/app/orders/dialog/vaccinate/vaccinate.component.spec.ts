import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinateComponent } from './vaccinate.component';

describe('VaccinateComponent', () => {
  let component: VaccinateComponent;
  let fixture: ComponentFixture<VaccinateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
