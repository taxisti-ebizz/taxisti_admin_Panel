import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view-online-driver',
  templateUrl: './view-online-driver.component.html',
  styleUrls: ['./view-online-driver.component.scss']
})
export class ViewOnlineDriverComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewOnlineDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
