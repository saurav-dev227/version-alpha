import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhMeteringComponent } from './wh-metering.component';

describe('WhMeteringComponent', () => {
  let component: WhMeteringComponent;
  let fixture: ComponentFixture<WhMeteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhMeteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhMeteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
