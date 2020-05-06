// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API
import { ApiService } from '../../../../../services/api.service';

//Ngx Spinner
import { NgxSpinnerService } from 'ngx-spinner';

//Http Header
import { HttpHeaders } from '@angular/common/http';


@Component({
	selector: 'kt-delete-entity-dialog',
	templateUrl: './delete-entity-dialog.component.html'
})
export class DeleteEntityDialogComponent implements OnInit {
	// Public properties
	viewLoading = false;

	deleteCallback;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<DeleteEntityDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpService,
		private api: ApiService,
		private spinner: NgxSpinnerService
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

	public setDeleteCallback(onDelete): void{
		this.deleteCallback = onDelete;
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
	onYesClick(id,type): void {
		/* Server loading imitation. Remove this */
		this.viewLoading = true;

		switch (type) {
			case 'user':
				this.http.deleteReq(this.api.deleteUser+id).subscribe(res => {
					const result : any = res;
					if(result.status == true){
						setTimeout(() => {
							this.dialogRef.close(true); // Keep only this row
						}, 2500);
					}
				})
			break;
			case 'driver':
				this.http.deleteReq(this.api.deleteDriver+id).subscribe(res => {
					const result : any = res;
					if(result.status == true){
						setTimeout(() => {
							if(this.deleteCallback != undefined){
								this.deleteCallback()
							}
							this.dialogRef.close(true); // Keep only this row
						}, 2500);
					}
				})
			break;
			case 'dltCarImg': 
				this.http.deleteReq(this.api.deleteCarImage+id).subscribe(res => {
					const result : any = res;
					if(result.status == true){
						setTimeout(() => {
							this.dialogRef.close(true); // Keep only this row
						}, 2500);
					}
				})
			break;
			case 'deleteRides': 
				var ids = '';

				id.forEach(element => {
					if(ids!=''){
						ids += ',';
					}
					ids += element;
				});

				const data = {
					'id' : ids
				}

				this.http.postReqForVerify(this.api.deleteRide, data).subscribe(res => {
					const result : any = res;
					if(result.status == true){
						setTimeout(() => {
							this.dialogRef.close(true); // Keep only this row
						}, 2500);
					}
				})
			break;
			case 'deleteRide' :
					
				const deleteData = {
					'id' : id
				}

				this.http.postReqForVerify(this.api.deleteRide, deleteData).subscribe(res => {
					const result : any = res;
					if(result.status == true){
						setTimeout(() => {
							this.dialogRef.close(true); // Keep only this row
						}, 2500);
					}
				})

			break;
		}

		

		
	}
}
