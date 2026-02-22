import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FemsDialogComponent } from './fems-dialog.component';

describe('FemsDialogComponent', () => {
  let component: FemsDialogComponent;
  let fixture: ComponentFixture<FemsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FemsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
