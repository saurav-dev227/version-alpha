import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredDeviceDetailsFemsComponent } from './expired-device-details-fems.component';

describe('ExpiredDeviceDetailsFemsComponent', () => {
  let component: ExpiredDeviceDetailsFemsComponent;
  let fixture: ComponentFixture<ExpiredDeviceDetailsFemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredDeviceDetailsFemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredDeviceDetailsFemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
