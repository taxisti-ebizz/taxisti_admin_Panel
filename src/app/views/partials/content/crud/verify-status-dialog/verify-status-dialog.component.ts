// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API
import { ApiService } from '../../../../../services/api.service';

@Component({
	selector: 'kt-verify-status-dialog',
	templateUrl: './verify-status-dialog.component.html'
})
export class VerifyStatusDialogComponent implements OnInit {
	// Public properties
	viewLoading = false;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<VerifyStatusDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpService,
		private api: ApiService,
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

	/**
	 * Close dialog with false result
	 */
	onNoClick(): void {
		this.dialogRef.close();
	}

	/**
	 * Close dialog with true result
	 */
	onYesClick(user_id,status): void {
		/* Server loading imitation. Remove this */
		this.viewLoading = true;

		const data = {
			"user_id" : user_id,
			"verify" : status
		}

		this.http.postReq(this.api.updateUserStatus,data).subscribe(res => {
			const result : any = res;
			if(result.status == true){
				setTimeout(() => {
					this.dialogRef.close(true); // Keep only this row
				}, 2500);
			}
		})

		
	}
}

