import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-review-user-details',
  templateUrl: './review-user-details.component.html',
  styleUrls: ['./review-user-details.component.scss']
})
export class ReviewUserDetailsComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ReviewUserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
