// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';

//Http API Method
import { HttpService } from '../../../../services/http.service';

//API
import { ApiService } from '../../../../services/api.service';

//Toastr Messages
import { ToastrService } from 'ngx-toastr';

import AXIOS from 'axios'
import { config } from 'process';

//Ngx Spinner
import { NgxSpinnerService } from 'ngx-spinner';

import { AdminAuthService } from '../../../../helper/admin-auth.service';

/**
 * ! Just example => Should be removed in development
 */
// const DEMO_PARAMS = {
// 	EMAIL: '',
// 	PASSWORD: 'demo'
// };

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];
	class = '';
	hide: boolean = true; // Used For Hide/Show Password

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private api : ApiService,
		private http : HttpService,
		private spinner: NgxSpinnerService,
		private toastr : ToastrService,
		private adminAuthService: AdminAuthService) {
		this.unsubscribe = new Subject();

		if (this.adminAuthService.loggedIn()) {
			this.router.navigate(['/dashboard']);
		}
		else{
			this.router.navigate(['/']);
		}
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show
		// if (!this.authNoticeService.onNoticeChanged$.getValue()) {
		// 	const initialNotice = `Use account
		// 	<strong>${DEMO_PARAMS.EMAIL}</strong> and password
		// 	<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
		// 	this.authNoticeService.setNotice(initialNotice, 'info');
		// }

		this.loginForm = this.fb.group({
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.loginForm.controls;

		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			email_id: controls.email.value,
			password: controls.password.value
		}; 


		this.http
			.postRequest(this.api.login,authData)
			.pipe(
				tap(user => {
					
					if (user.status == true) {
						localStorage.setItem('token',user.data.token)
						localStorage.setItem('userDetail',JSON.stringify(user.data))
						this.spinner.hide();
					 	this.router.navigate(['/dashboard']);
					} else {
						if (user.errors.password) { 
							this.toastr.error(user.errors.password[0]);
						}
						else{
							this.toastr.error(user.message);
						}
					}
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
