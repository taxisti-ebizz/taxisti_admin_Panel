import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view-sub-admin-user-detail',
  templateUrl: './view-sub-admin-user-detail.component.html',
  styleUrls: ['./view-sub-admin-user-detail.component.scss']
})
export class ViewSubAdminUserDetailComponent implements OnInit {

    viewLoading : true;
    constructor(public dialogRef: MatDialogRef<ViewSubAdminUserDetailComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

}
