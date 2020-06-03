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

// Components
import { PromotionManagementComponent } from './promotion-management.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { EditPromotionComponent } from './edit-promotion/edit-promotion.component';
import { AddPromotionComponent } from './add-promotion/add-promotion.component';
import { PromotionUserListComponent } from './promotion-user-list/promotion-user-list.component';
import { PromotionFilterComponent } from './promotion-list/promotion-filter/promotion-filter.component';
import { PromotionUserFilterComponent } from './promotion-user-list/promotion-user-filter/promotion-user-filter.component';


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
		component: PromotionManagementComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'promotion-list',
				component: PromotionListComponent
      },
      {
				path: 'promotion-user-list',
				component: PromotionUserListComponent
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
    PromotionManagementComponent,
    PromotionListComponent,
    EditPromotionComponent,
    AddPromotionComponent,
    PromotionUserListComponent,
    PromotionFilterComponent,
    PromotionUserFilterComponent
  ],
  entryComponents: [
    EditPromotionComponent,
    AddPromotionComponent,
    PromotionFilterComponent,
    PromotionUserFilterComponent
  ]
})
export class PromotionManagementModule { }
