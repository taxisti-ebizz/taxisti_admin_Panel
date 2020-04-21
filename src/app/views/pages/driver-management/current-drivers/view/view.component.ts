import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  
    viewLoading : true;
    constructor(public dialogRef: MatDialogRef<ViewComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }
}
