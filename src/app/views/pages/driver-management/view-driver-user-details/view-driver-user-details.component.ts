import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view-driver-user-details',
  templateUrl: './view-driver-user-details.component.html',
  styleUrls: ['./view-driver-user-details.component.scss']
})
export class ViewDriverUserDetailsComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewDriverUserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
