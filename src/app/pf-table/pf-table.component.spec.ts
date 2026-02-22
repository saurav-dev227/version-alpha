import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PfTableComponent } from './pf-table.component';

describe('PfTableComponent', () => {
  let component: PfTableComponent;
  let fixture: ComponentFixture<PfTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PfTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PfTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
