import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailsFemsComponent } from './device-details-fems.component';

describe('DeviceDetailsFemsComponent', () => {
  let component: DeviceDetailsFemsComponent;
  let fixture: ComponentFixture<DeviceDetailsFemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDetailsFemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDetailsFemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
