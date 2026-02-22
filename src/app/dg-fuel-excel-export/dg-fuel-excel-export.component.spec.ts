import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DgFuelExcelExportComponent } from './dg-fuel-excel-export.component';

describe('DgFuelExcelExportComponent', () => {
  let component: DgFuelExcelExportComponent;
  let fixture: ComponentFixture<DgFuelExcelExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DgFuelExcelExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DgFuelExcelExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
