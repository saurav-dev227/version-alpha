import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSwitchdashComponent } from './dialog-switchdash.component';

describe('DialogSwitchdashComponent', () => {
  let component: DialogSwitchdashComponent;
  let fixture: ComponentFixture<DialogSwitchdashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSwitchdashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSwitchdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
