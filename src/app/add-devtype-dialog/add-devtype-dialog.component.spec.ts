import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDevtypeDialogComponent } from './add-devtype-dialog.component';

describe('AddDevtypeDialogComponent', () => {
  let component: AddDevtypeDialogComponent;
  let fixture: ComponentFixture<AddDevtypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDevtypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDevtypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
