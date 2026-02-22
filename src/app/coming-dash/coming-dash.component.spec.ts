import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingDashComponent } from './coming-dash.component';

describe('ComingDashComponent', () => {
  let component: ComingDashComponent;
  let fixture: ComponentFixture<ComingDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComingDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComingDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
