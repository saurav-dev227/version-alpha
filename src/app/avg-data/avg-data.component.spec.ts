import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgDataComponent } from './avg-data.component';

describe('AvgDataComponent', () => {
  let component: AvgDataComponent;
  let fixture: ComponentFixture<AvgDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
