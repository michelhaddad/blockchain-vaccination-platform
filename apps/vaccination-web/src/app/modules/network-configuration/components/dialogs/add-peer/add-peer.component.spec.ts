import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeerComponent } from './add-peer.component';

describe('AddPeerComponent', () => {
  let component: AddPeerComponent;
  let fixture: ComponentFixture<AddPeerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPeerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
