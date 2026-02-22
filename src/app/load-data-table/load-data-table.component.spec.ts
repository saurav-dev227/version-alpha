import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDataTableComponent } from './load-data-table.component';

describe('LoadDataTableComponent', () => {
  let component: LoadDataTableComponent;
  let fixture: ComponentFixture<LoadDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
