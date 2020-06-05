import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'kt-view-contact-user-detail',
    templateUrl: './view-contact-user-detail.component.html',
    styleUrls: ['./view-contact-user-detail.component.scss']
})
export class ViewContactUserDetailComponent implements OnInit {

    viewLoading : true;
    constructor(public dialogRef: MatDialogRef<ViewContactUserDetailComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

}
