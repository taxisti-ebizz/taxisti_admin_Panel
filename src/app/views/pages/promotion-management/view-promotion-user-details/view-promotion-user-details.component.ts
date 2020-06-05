import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view-promotion-user-details',
  templateUrl: './view-promotion-user-details.component.html',
  styleUrls: ['./view-promotion-user-details.component.scss']
})
export class ViewPromotionUserDetailsComponent implements OnInit {

    viewLoading : true;
    constructor(public dialogRef: MatDialogRef<ViewPromotionUserDetailsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

}
