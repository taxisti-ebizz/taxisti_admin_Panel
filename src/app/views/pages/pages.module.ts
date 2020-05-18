// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MailModule } from './apps/mail/mail.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';
import { MyPageComponent } from './my-page/my-page.component';
import { RideManagementModule } from './ride-management/ride-management.module';
import { ReviewManagementModule } from './review-management/review-management.module';
import { RideAreaSettingsModule } from './ride-area-settings/ride-area-settings.module';
import { OptionsModule } from './options/options.module';
import { NotificationManagementModule } from './notification-management/notification-management.module';
import { ContactUsManagementModule } from './contact-us-management/contact-us-management.module';
import { PageManagementModule } from './page-management/page-management.module';
import { SubAdminModule } from './sub-admin/sub-admin.module';

@NgModule({
	declarations: [MyPageComponent],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		MailModule,
		ECommerceModule,
		UserManagementModule,
		RideManagementModule,
		ReviewManagementModule,
		RideAreaSettingsModule,
		OptionsModule,
		NotificationManagementModule,
		ContactUsManagementModule,
		PageManagementModule,
		SubAdminModule
	],
	providers: []
})
export class PagesModule {
}
