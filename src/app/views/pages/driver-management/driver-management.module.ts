// Angular
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { DriverManagementComponent } from './driver-management.component';

import { AllDriverListComponent } from './drivers/all-driver-list/all-driver-list.component';
import { DriverListComponent } from './drivers/driver-list/driver-list.component';
import { DriverEditComponent } from './drivers/driver-edit/driver-edit.component';
import { ViewDriverDetailsComponent } from './drivers/view-driver-details/view-driver-details.component';
import { ListComponent } from './current-drivers/list/list.component';
import { EditComponent } from './current-drivers/edit/edit.component';
import { ViewComponent } from './current-drivers/view/view.component';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';
import {
	usersReducer,
	UserEffects
} from '../../../core/auth';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';




const routes: Routes = [
	{
		path: '',
		component: DriverManagementComponent,
		children: [
			{
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      		},
      		{
				path: 'all-drivers-list',
				component: DriverListComponent
			},
			{
				path: 'current-drivers-list',
				component: ListComponent
			},
		]
	}
];

@NgModule({
  imports: [
    CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('users', usersReducer),
        EffectsModule.forFeature([UserEffects]),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,
		NgbPaginationModule
  ],
  providers: [
		InterceptService,
		{
        	provide: HTTP_INTERCEPTORS,
       	 	useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
		DatePipe
	],
	entryComponents: [
		ActionNotificationComponent,
		ViewDriverDetailsComponent,
		DriverEditComponent,
		ViewComponent
	],
	declarations: [
		DriverManagementComponent,
		AllDriverListComponent,
		DriverEditComponent,
		ViewDriverDetailsComponent,
		ListComponent,
		EditComponent,
		ViewComponent,
		DriverListComponent
	]
})
export class DriverManagementModule { }
