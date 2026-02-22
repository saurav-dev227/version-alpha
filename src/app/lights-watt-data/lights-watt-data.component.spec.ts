import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightsWattDataComponent } from './lights-watt-data.component';

describe('LightsWattDataComponent', () => {
  let component: LightsWattDataComponent;
  let fixture: ComponentFixture<LightsWattDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightsWattDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightsWattDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
