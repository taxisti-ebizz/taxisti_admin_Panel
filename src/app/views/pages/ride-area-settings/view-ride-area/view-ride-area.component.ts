import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'kt-view-ride-area',
  templateUrl: './view-ride-area.component.html',
  styleUrls: ['./view-ride-area.component.scss']
})
export class ViewRideAreaComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewRideAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
