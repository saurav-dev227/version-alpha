import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirePumpAlarmComponent } from './fire-pump-alarm.component';

describe('FirePumpAlarmComponent', () => {
  let component: FirePumpAlarmComponent;
  let fixture: ComponentFixture<FirePumpAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirePumpAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirePumpAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
