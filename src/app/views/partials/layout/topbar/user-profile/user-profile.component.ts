// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';

//Services
//import { CommonService } from '../../../../../services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;
	username = '';
	profile_pic = '';

	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>,
		private router: Router,
    	private toastr: ToastrService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		//this.user$ = this.store.pipe(select(currentUser));
		this.username = localStorage.getItem('userDetail')!=''?JSON.parse(localStorage.getItem('userDetail')).name:'Admin';
	}

	/**
	 * Log out
	 */
	logout() {
		//this.store.dispatch(new Logout());
		this.toastr.success("Logout Successfully");
		localStorage.clear();
		this.router.navigate(['/']);
		
		// setTimeout(() => {
		// 	location.reload();
		// }, 1000);
	}
}
