import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'kt-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  // Public properties
	//customer: CustomerModel;
	customerForm: FormGroup;
	hasFormErrors = false;
  viewLoading = false;
  
  constructor(public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    //this.customer = this.data.customer;
  }

  onSubmit() {
  }

}
