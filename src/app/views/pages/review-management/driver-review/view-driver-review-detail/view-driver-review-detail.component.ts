import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as xlsx from 'xlsx';

@Component({
  selector: 'kt-view-driver-review-detail',
  templateUrl: './view-driver-review-detail.component.html',
  styleUrls: ['./view-driver-review-detail.component.scss']
})
export class ViewDriverReviewDetailComponent implements OnInit {

  // @ViewChild('epltable', { static: false }) epltable: ElementRef;

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewDriverReviewDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  exportToExcel() {
    /* table id is passed over here */   
    let element = document.getElementById('driver-review-table'); 
    const ws: xlsx.WorkSheet =   
    xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'Driver_review_data.xlsx');
  }

}
