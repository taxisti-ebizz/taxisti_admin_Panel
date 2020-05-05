import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeRideListComponent } from './fake-ride-list.component';

describe('FakeRideListComponent', () => {
  let component: FakeRideListComponent;
  let fixture: ComponentFixture<FakeRideListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FakeRideListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeRideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
