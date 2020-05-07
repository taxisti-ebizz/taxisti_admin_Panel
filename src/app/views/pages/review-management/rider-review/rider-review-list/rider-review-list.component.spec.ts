import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderReviewListComponent } from './rider-review-list.component';

describe('RiderReviewListComponent', () => {
  let component: RiderReviewListComponent;
  let fixture: ComponentFixture<RiderReviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderReviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
