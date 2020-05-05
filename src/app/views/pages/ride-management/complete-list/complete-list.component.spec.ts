import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteListComponent } from './complete-list.component';

describe('CompleteListComponent', () => {
  let component: CompleteListComponent;
  let fixture: ComponentFixture<CompleteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
