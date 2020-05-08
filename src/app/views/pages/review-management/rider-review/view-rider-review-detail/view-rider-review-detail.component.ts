import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as xlsx from 'xlsx';

@Component({
  selector: 'kt-view-rider-review-detail',
  templateUrl: './view-rider-review-detail.component.html',
  styleUrls: ['./view-rider-review-detail.component.scss']
})
export class ViewRiderReviewDetailComponent implements OnInit {

  viewLoading : true;
  constructor(public dialogRef: MatDialogRef<ViewRiderReviewDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  exportToExcel() {
    /* table id is passed over here */   
    let element = document.getElementById('rider-review-table'); 
    const ws: xlsx.WorkSheet =   
    xlsx.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'Rider_review_data.xlsx');
  }

}
