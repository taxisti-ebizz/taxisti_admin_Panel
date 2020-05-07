import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'kt-view-driver-review-detail',
  templateUrl: './view-driver-review-detail.component.html',
  styleUrls: ['./view-driver-review-detail.component.scss']
})
export class ViewDriverReviewDetailComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewDriverReviewDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
