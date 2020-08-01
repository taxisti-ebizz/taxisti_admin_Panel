import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-review-driver-details',
  templateUrl: './review-driver-details.component.html',
  styleUrls: ['./review-driver-details.component.scss']
})
export class ReviewDriverDetailsComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ReviewDriverDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
