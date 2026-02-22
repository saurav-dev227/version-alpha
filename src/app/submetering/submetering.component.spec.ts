import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmeteringComponent } from './submetering.component';

describe('SubmeteringComponent', () => {
  let component: SubmeteringComponent;
  let fixture: ComponentFixture<SubmeteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmeteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmeteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
