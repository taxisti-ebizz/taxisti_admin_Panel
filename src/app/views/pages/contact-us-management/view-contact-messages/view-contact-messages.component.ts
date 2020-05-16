import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view-contact-messages',
  templateUrl: './view-contact-messages.component.html',
  styleUrls: ['./view-contact-messages.component.scss']
})
export class ViewContactMessagesComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewContactMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
