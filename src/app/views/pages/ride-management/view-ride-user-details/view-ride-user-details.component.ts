import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view-ride-user-details',
  templateUrl: './view-ride-user-details.component.html',
  styleUrls: ['./view-ride-user-details.component.scss']
})
export class ViewRideUserDetailsComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewRideUserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
