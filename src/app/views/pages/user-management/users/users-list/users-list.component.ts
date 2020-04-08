import { AfterViewInit, AfterViewChecked } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatTableDataSource, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
// Models
import {
	User,
	Role,
	UsersDataSource,
	UserDeleted,
	UsersPageRequested,
	selectUserById,
	selectAllRoles
} from '../../../../../core/auth';
import { SubheaderService } from '../../../../../core/_base/layout';

//Http API Method
import { HttpService } from '../../../../../services/http.service';

//API
import { ApiService } from '../../../../../services/api.service';

//Edit User Modal
import { EditUserComponent } from '../edit-user/edit-user.component';

//Spinner
import { NgxSpinnerService } from 'ngx-spinner';

// Edit User Service
import { EditUserService } from '../../../../../services/user/edit-user.service';



// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'kt-users-list',
	templateUrl: './users-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy {

	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;


	// Table fields
	//dataSource: UsersDataSource;
	displayedColumns = ['id', 'username', 'mobile_no', 'completed_ride', 'cancelled_ride', 'total_reviews', 'average_rating', 'date_of_birth', 'date_of_register', 'device_type', 'verify', 'actions'];
	//@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	//@ViewChild('sort1', {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<User>(true, []);
	usersResult: User[] = [];
	allRoles: Role[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];
	page = 1
	pageSize = 10
	count = 0;
	dataObj = {}
	
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		private http: HttpService,
		private api: ApiService,
		public dialog: MatDialog,
		private spinner: NgxSpinnerService,
		private editUserService : EditUserService) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// load roles list
		const rolesSubscription = this.store.pipe(select(selectAllRoles)).subscribe(res => this.allRoles = res);
		this.subscriptions.push(rolesSubscription);

		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		// const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
		// 	tap(() => {
		// 		this.loadUsersList();
		// 	})
		// )
		// .subscribe();
		// this.subscriptions.push(paginatorSubscriptions);


		// Filtration, bind to searchInput
		//==================================================Commented By VS==================================================
			// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// 	// tslint:disable-next-line:max-line-length
			// 	debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			// 	distinctUntilChanged(), // This operator will eliminate duplicate values
			// 	tap(() => {
			// 		this.paginator.pageIndex = 0;
			// 		this.loadUsersList();
			// 	})
			// )
			// .subscribe();
			// this.subscriptions.push(searchSubscription);
		//==================================================End Commented By VS==================================================

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('User management');

		// Init DataSource
		// this.dataSource = new UsersDataSource(this.store);
		// const entitiesSubscription = this.dataSource.entitySubject.pipe(
		// 	skip(1),
		// 	distinctUntilChanged()
		// ).subscribe(res => {
		// 	this.usersResult = res;
		// });
		// this.subscriptions.push(entitiesSubscription);

		// First Load
		// of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
		// 	this.loadUsersList();
		// });

		//Get User List
		this.userList();
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	userList(){
		try {

			const data = {
				"page":this.page,
				//"size":this.pageSize
			}

			this.http.postReq(this.api.userList,data).subscribe(res => {
				const result: any = res;
				if (result.status == true) {
					this.count = result.data.total;
					console.log("count ========>>>>>>",result.data.total);
					

					var i = 1;
					result.data.data.forEach(element => {
						element.id = i;
						i++;
					});
					
					this.loadData(result.data);
				}
				else{
					//this.spinner.hide();
					//$('#disableprofilepope').modal('show');
					
				}
			});

		} catch (error) {
			// this.errorMsg = error.error.message;
			// this.spinner.show();
		}
	}
	

	loadData(data) {

		this.selection.clear();
		setTimeout(() => {
			this.dataSource = new MatTableDataSource(data.data);
			this.paginator = this.paginator;
			this.sort = this.sort;
			this.filterConfiguration()
			//this.spinner.hide();
		});
	}

	//User list search filter
	applyFilter(filterValue: string) {
		console.log("filterValue ======>>>>",filterValue);
		
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * Load users list
	 */

	//========================================Comment By VS ===============================================
		// loadUsersList() {
		// 	this.selection.clear();
		// 	const queryParams = new QueryParamsModel(
		// 		this.filterConfiguration(),
		// 		this.sort.direction,
		// 		this.sort.active,
		// 		this.paginator.pageIndex,
		// 		this.paginator.pageSize
		// 	);
		// 	this.store.dispatch(new UsersPageRequested({ page: queryParams }));
		// 	this.selection.clear();
		// }
	//========================================End Comment By VS ===============================================

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.lastName = searchText;

		filter.username = searchText;
		filter.email = searchText;
		filter.fillname = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete user
	 *
	 * @param _item: User
	 */
	deleteUser(_item: User) {
		const _title = 'User Delete';
		const _description = 'Are you sure to permanently delete this user?';
		const _waitDesciption = 'User is deleting...';
		const _deleteMessage = `User has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new UserDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	/**
	 * Fetch selected rows
	 */
	fetchUsers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.fullname}, ${elem.email}`,
				id: elem.id.toString(),
				status: elem.username
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.usersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.usersResult.length) {
			this.selection.clear();
		} else {
			this.usersResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns user roles string
	 *
	 * @param user: User
	 */
	getUserRolesStr(user: User): string {
		const titles: string[] = [];
		each(user.roles, (roleId: number) => {
			const _role = find(this.allRoles, (role: Role) => role.id === roleId);
			if (_role) {
				titles.push(_role.title);
			}
		});
		return titles.join(', ');
	}

	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	// editUser(id) {
	// 	this.router.navigate(['../users/edit', id], { relativeTo: this.activatedRoute });
	// }

	//Handle Page
	handlePage(event){
		this.page = event;
		this.userList();
	}

	/*
	  Open Add Member Card Modal
	*/
	editUser(user) {
		this.editUserService.mode = 2;

		const dialogRef = this.dialog.open(EditUserComponent, {
			width: '700px',
			height: 'auto',
			backdropClass: 'masterModalPopup',
			data: { mode: this.editUserService.mode, userData : user }
		});
		dialogRef.afterClosed().subscribe(result => {
			
			if (result === "close" || result === undefined) {
				this.userList();
				
			} else if (result === false) {
				this.spinner.hide();
			}
		});
	}
}
