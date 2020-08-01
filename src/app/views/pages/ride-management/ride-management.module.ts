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
import { RideManagementComponent } from './ride-management.component';

//All Ride 
import { PendingListComponent } from './pending-list/pending-list.component';
import { RunningListComponent } from './running-list/running-list.component';
import { CompleteListComponent } from './complete-list/complete-list.component';
import { NoResponseListComponent } from './no-response-list/no-response-list.component';
import { CanceledListComponent } from './canceled-list/canceled-list.component';
import { NoDriverAvailableListComponent } from './no-driver-available-list/no-driver-available-list.component';
import { FakeRideListComponent } from './fake-ride-list/fake-ride-list.component';
import { RidesFilterComponent } from './rides-filter/rides-filter.component';
import { OthersRideFilterComponent } from './others-ride-filter/others-ride-filter.component';
import { NoDriverAvailableFilterComponent } from './no-driver-available-list/no-driver-available-filter/no-driver-available-filter.component';

//View Ride User details
import { ViewRideUserDetailsComponent } from './view-ride-user-details/view-ride-user-details.component';
import { ViewRideDriverDetailsComponent } from './view-ride-driver-details/view-ride-driver-details.component';

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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


const routes: Routes = [
	{
		path: '',
		component: RideManagementComponent,
		children: [
			{
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'pending-rides',
				component: PendingListComponent
      },
      {
				path: 'pending-rides/:id',
				component: PendingListComponent
      },
      {
				path: 'running-rides',
				component: RunningListComponent
      },
      {
				path: 'running-rides/:id',
				component: RunningListComponent
      },
      {
				path: 'complete-rides',
				component: CompleteListComponent
      },
      {
				path: 'complete-rides/:id',
				component: CompleteListComponent
      },
      {
				path: 'auto-canceled-rides',
				component: NoResponseListComponent
      },
      {
				path: 'auto-canceled-rides/:id',
				component: NoResponseListComponent
      },
      {
				path: 'canceled-rides',
				component: CanceledListComponent
      },
      {
				path: 'canceled-rides/:id',
				component: CanceledListComponent
      },
      {
				path: 'driver-not-available',
				component: NoDriverAvailableListComponent
      },
      {
				path: 'driver-not-available/:id',
				component: NoDriverAvailableListComponent
      },
      {
				path: 'fake-rides',
				component: FakeRideListComponent
      },
      {
				path: 'fake-rides/:id',
				component: FakeRideListComponent
			}
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
        NgbPaginationModule,
        NgMultiSelectDropDownModule.forRoot(),
		    BsDatepickerModule.forRoot()
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
    declarations: [
      RideManagementComponent,
      PendingListComponent,
      RunningListComponent,
      CompleteListComponent,
      NoResponseListComponent,
      CanceledListComponent,
      NoDriverAvailableListComponent,
      FakeRideListComponent,
      RidesFilterComponent,
      OthersRideFilterComponent,
      NoDriverAvailableFilterComponent,
      ViewRideUserDetailsComponent,
      ViewRideDriverDetailsComponent
    ],
    entryComponents : [
      RidesFilterComponent,
      OthersRideFilterComponent,
      NoDriverAvailableFilterComponent,
      ViewRideUserDetailsComponent,
      ViewRideDriverDetailsComponent
    ]
})
export class RideManagementModule { }
