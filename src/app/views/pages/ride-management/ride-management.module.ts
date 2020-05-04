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
    declarations: [
      RideManagementComponent,
      PendingListComponent
    ],
})
export class RideManagementModule { }
