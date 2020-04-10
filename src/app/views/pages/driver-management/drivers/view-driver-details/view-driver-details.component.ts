import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view-driver-details',
  templateUrl: './view-driver-details.component.html',
  styleUrls: ['./view-driver-details.component.scss']
})
export class ViewDriverDetailsComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewDriverDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
