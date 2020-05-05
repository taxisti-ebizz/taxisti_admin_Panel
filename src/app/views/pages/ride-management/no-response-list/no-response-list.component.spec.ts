import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResponseListComponent } from './no-response-list.component';

describe('NoResponseListComponent', () => {
  let component: NoResponseListComponent;
  let fixture: ComponentFixture<NoResponseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoResponseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResponseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
