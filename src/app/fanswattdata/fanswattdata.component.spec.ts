import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanswattdataComponent } from './fanswattdata.component';

describe('FanswattdataComponent', () => {
  let component: FanswattdataComponent;
  let fixture: ComponentFixture<FanswattdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanswattdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanswattdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
