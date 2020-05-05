import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDriverAvailableListComponent } from './no-driver-available-list.component';

describe('NoDriverAvailableListComponent', () => {
  let component: NoDriverAvailableListComponent;
  let fixture: ComponentFixture<NoDriverAvailableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoDriverAvailableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDriverAvailableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
