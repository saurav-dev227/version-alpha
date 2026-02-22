import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FemsComponent } from './fems.component';

describe('FemsComponent', () => {
  let component: FemsComponent;
  let fixture: ComponentFixture<FemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
