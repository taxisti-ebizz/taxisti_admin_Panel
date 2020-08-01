import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'kt-view-ride-driver-details',
  templateUrl: './view-ride-driver-details.component.html',
  styleUrls: ['./view-ride-driver-details.component.scss']
})
export class ViewRideDriverDetailsComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewRideDriverDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
