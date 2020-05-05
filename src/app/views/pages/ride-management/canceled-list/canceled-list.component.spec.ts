import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanceledListComponent } from './canceled-list.component';

describe('CanceledListComponent', () => {
  let component: CanceledListComponent;
  let fixture: ComponentFixture<CanceledListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanceledListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanceledListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
