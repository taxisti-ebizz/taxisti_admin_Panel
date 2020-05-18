// Angular
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Components
import {BaseComponent} from './views/theme/base/base.component';
import {ErrorPageComponent} from './views/theme/content/error-page/error-page.component';
// Auth
import {AuthGuard} from './core/auth';
import { LoginComponent } from './views/pages/auth/login/login.component'; // Used for login functionality
import { AuthGuardService } from './helper/auth-guard.service'; // Used for authentication

const routes: Routes = [
	// { path: '', component: LoginComponent },
	{path: '', loadChildren: () => import('../app/views/pages/auth/auth.module').then(m => m.AuthModule)},

	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuardService],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
			},
			{
				path: 'mail',
				loadChildren: () => import('../app/views/pages/apps/mail/mail.module').then(m => m.MailModule),
			},
			{
				path: 'ecommerce',
				loadChildren: () => import('../app/views/pages/apps/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
			},
			{
				path: 'ngbootstrap',
				loadChildren: () => import('../app/views/pages/ngbootstrap/ngbootstrap.module').then(m => m.NgbootstrapModule),
			},
			{
				path: 'material',
				loadChildren: () => import('../app/views/pages/material/material.module').then(m => m.MaterialModule),
			},
			{
				path: 'user-management',
				loadChildren: () => import('../app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule),
			},
			{
				path: 'user-list-management',
				loadChildren: () => import('../app/views/pages/user-list-management/user-list-management.module').then(m => m.UserListManagementModule),
			},
			{
				path: 'driver-management',
				loadChildren: () => import('../app/views/pages/driver-management/driver-management.module').then(m => m.DriverManagementModule),
			},
			{
				path: 'ride-management',
				loadChildren: () => import('../app/views/pages/ride-management/ride-management.module').then(m => m.RideManagementModule),
			},
			{
				path: 'review-management',
				loadChildren: () => import('../app/views/pages/review-management/review-management.module').then(m => m.ReviewManagementModule),
			},
			{
				path: 'ride-area-settings',
				loadChildren: () => import('../app/views/pages/ride-area-settings/ride-area-settings.module').then(m => m.RideAreaSettingsModule),
			},
			{
				path: 'promotion-management',
				loadChildren: () => import('../app/views/pages/promotion-management/promotion-management.module').then(m => m.PromotionManagementModule),
			},
			{
				path: 'options',
				loadChildren: () => import('../app/views/pages/options/options.module').then(m => m.OptionsModule),
			},
			{
				path: 'notification-management',
				loadChildren: () => import('../app/views/pages/notification-management/notification-management.module').then(m => m.NotificationManagementModule),
			},
			{
				path: 'contact-us-management',
				loadChildren: () => import('../app/views/pages/contact-us-management/contact-us-management.module').then(m => m.ContactUsManagementModule),
			},
			{
				path: 'page-management',
				loadChildren: () => import('../app/views/pages/page-management/page-management.module').then(m => m.PageManagementModule),
			},
			{
				path: 'sub-admin',
				loadChildren: () => import('../app/views/pages/sub-admin/sub-admin.module').then(m => m.SubAdminModule),
			},
			{
				path: 'wizard',
				loadChildren: () => import('../app/views/pages/wizard/wizard.module').then(m => m.WizardModule),
			},
			{
				path: 'builder',
				loadChildren: () => import('../app/views/theme/content/builder/builder.module').then(m => m.BuilderModule),
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
				},
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
		],
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {
}
