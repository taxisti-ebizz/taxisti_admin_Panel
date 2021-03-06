export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
				},
				// {
				// 	title: 'Custom',
				// 	root: true,
				// 	alignment: 'left',
				// 	toggle: 'click',
				// 	submenu: [
				// 		{
				// 			title: 'Error Pages',
				// 			bullet: 'dot',
				// 			icon: 'flaticon2-list-2',
				// 			submenu: [
				// 				{
				// 					title: 'Error 1',
				// 					page: '/error/error-v1'
				// 				},
				// 				{
				// 					title: 'Error 2',
				// 					page: '/error/error-v2'
				// 				},
				// 				{
				// 					title: 'Error 3',
				// 					page: '/error/error-v3'
				// 				},
				// 				{
				// 					title: 'Error 4',
				// 					page: '/error/error-v4'
				// 				},
				// 				{
				// 					title: 'Error 5',
				// 					page: '/error/error-v5'
				// 				},
				// 				{
				// 					title: 'Error 6',
				// 					page: '/error/error-v6'
				// 				},
				// 			]
				// 		},
				// 		{
				// 			title: 'Wizard',
				// 			bullet: 'dot',
				// 			icon: 'flaticon2-mail-1',
				// 			submenu: [
				// 				{
				// 					title: 'Wizard 1',
				// 					page: '/wizard/wizard-1'
				// 				},
				// 				{
				// 					title: 'Wizard 2',
				// 					page: '/wizard/wizard-2'
				// 				},
				// 				{
				// 					title: 'Wizard 3',
				// 					page: '/wizard/wizard-3'
				// 				},
				// 				{
				// 					title: 'Wizard 4',
				// 					page: '/wizard/wizard-4'
				// 				},
				// 			]
				// 		},
				// 	]
				// },
			]
		},
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: 'User Management',
					root: true,
					bullet: 'dot',
					icon: 'flaticon2-user-outline-symbol',
					page: '/user-list-management/users-list'
				},
				{
					title: 'Driver Management',
					root: true,
					bullet: 'dot',	
					icon: 'flaticon-user-settings',
					submenu: [
						{
							title: 'Current Drivers',
							page: '/driver-management/current-drivers-list'
						},
						{
							title: 'All Drivers',
							page: '/driver-management/all-drivers-list'
						},
						{
							title: 'Online Drivers',
							page: '/driver-management/online-drivers-list'
						},
						{
							title: 'Location',
							page: '/driver-management/location'
						}
					]
				},
				{
					title: 'Ride Management',
					root: true,
					bullet: 'dot',	
					icon: 'flaticon-truck',
					submenu: [
						{
							title: 'Pending',
							page: '/ride-management/pending-rides'
						},
						{
							title: 'Running',
							page: '/ride-management/running-rides'
						},
						{
							title: 'Complete',
							page: '/ride-management/complete-rides'
						},
						{
							title: 'No Response',
							page: '/ride-management/auto-canceled-rides'
						},
						{
							title: 'Canceled',
							page: '/ride-management/canceled-rides'
						},
						{
							title: 'No Driver Available',
							page: '/ride-management/driver-not-available'
						},
						{
							title: 'Fake Ride',
							page: '/ride-management/fake-rides'
						}
					]
				},
				{
					title: 'Review Management',
					root: true,
					bullet: 'dot',	
					icon: 'flaticon-speech-bubble',
					submenu: [
						{
							title: 'Drivers Review',
							page: '/review-management/drivers-review'
						},
						{
							title: 'Riders Review',
							page: '/review-management/riders-review'
						}
					]
				},
				{
					title: 'Ride Area Settings',
					root: true,
					bullet: 'dot',	
					icon: 'fas fa-car',
					submenu: [
						{
							title: 'Ride Area List',
							page: '/ride-area-settings/ride-area-list'
						},
						{
							title: 'Add Ride Area',
							page: '/ride-area-settings/add-ride-area'
						}
					]
				},
				{
					title: 'Promotion Management',
					root: true,
					bullet: 'dot',	
					icon: 'flaticon-medal',
					submenu: [
						{
							title: 'Promotion User List',
							page: '/promotion-management/promotion-user-list'
						},
						{
							title: 'Promotion List',
							page: '/promotion-management/promotion-list'
						}
					]
				},
				{
					title: 'Options',
					root: true,
					icon: 'flaticon2-settings',
					page: '/options/option-details',
					bullet: 'dot',
				},
				{
					title: 'Notification',
					root: true,
					icon: 'flaticon2-notification',
					page: '/notification-management/send-notification',
					bullet: 'dot',
				},
				{
					title: 'Contact Us',
					root: true,
					icon: 'flaticon2-phone',
					page: '/contact-us-management/contact-us-list',
					bullet: 'dot',
				},
				{
					title: 'Page Management',
					root: true,
					icon: 'flaticon-notepad',
					page: '/page-management/page-list',
					bullet: 'dot',
				},
				{
					title: 'Sub Admin',
					root: true,
					icon: 'flaticon-user-add',
					page: '/sub-admin/list',
					bullet: 'dot',
				},
				{
					title: 'Driver Online Log',
					root: true,
					icon: 'flaticon2-analytics',
					page: '/driver-online-log/report',
					bullet: 'dot',
				},
				// {
				// 	title: 'Layout Builder',
				// 	root: true,
				// 	icon: 'flaticon2-expand',
				// 	page: '/builder'
				// },
				// {section: 'Components'},
				// {
				// 	title: 'Google Material',
				// 	root: true,
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-browser-2',
				// 	submenu: [
				// 		{
				// 			title: 'Form Controls',
				// 			bullet: 'dot',
				// 			submenu: [
				// 				{
				// 					title: 'Auto Complete',
				// 					page: '/material/form-controls/autocomplete',
				// 					permission: 'accessToECommerceModule'
				// 				},
				// 				{
				// 					title: 'Checkbox',
				// 					page: '/material/form-controls/checkbox'
				// 				},
				// 				{
				// 					title: 'Radio Button',
				// 					page: '/material/form-controls/radiobutton'
				// 				},
				// 				{
				// 					title: 'Datepicker',
				// 					page: '/material/form-controls/datepicker'
				// 				},
				// 				{
				// 					title: 'Form Field',
				// 					page: '/material/form-controls/formfield'
				// 				},
				// 				{
				// 					title: 'Input',
				// 					page: '/material/form-controls/input'
				// 				},
				// 				{
				// 					title: 'Select',
				// 					page: '/material/form-controls/select'
				// 				},
				// 				{
				// 					title: 'Slider',
				// 					page: '/material/form-controls/slider'
				// 				},
				// 				{
				// 					title: 'Slider Toggle',
				// 					page: '/material/form-controls/slidertoggle'
				// 				}
				// 			]
				// 		},
				// 		{
				// 			title: 'Navigation',
				// 			bullet: 'dot',
				// 			submenu: [
				// 				{
				// 					title: 'Menu',
				// 					page: '/material/navigation/menu'
				// 				},
				// 				{
				// 					title: 'Sidenav',
				// 					page: '/material/navigation/sidenav'
				// 				},
				// 				{
				// 					title: 'Toolbar',
				// 					page: '/material/navigation/toolbar'
				// 				}
				// 			]
				// 		},
				// 		{
				// 			title: 'Layout',
				// 			bullet: 'dot',
				// 			submenu: [
				// 				{
				// 					title: 'Card',
				// 					page: '/material/layout/card'
				// 				},
				// 				{
				// 					title: 'Divider',
				// 					page: '/material/layout/divider'
				// 				},
				// 				{
				// 					title: 'Expansion panel',
				// 					page: '/material/layout/expansion-panel'
				// 				},
				// 				{
				// 					title: 'Grid list',
				// 					page: '/material/layout/grid-list'
				// 				},
				// 				{
				// 					title: 'List',
				// 					page: '/material/layout/list'
				// 				},
				// 				{
				// 					title: 'Tabs',
				// 					page: '/material/layout/tabs'
				// 				},
				// 				{
				// 					title: 'Stepper',
				// 					page: '/material/layout/stepper'
				// 				},
				// 				{
				// 					title: 'Default Forms',
				// 					page: '/material/layout/default-forms'
				// 				},
				// 				{
				// 					title: 'Tree',
				// 					page: '/material/layout/tree'
				// 				}
				// 			]
				// 		},
				// 		{
				// 			title: 'Buttons & Indicators',
				// 			bullet: 'dot',
				// 			submenu: [
				// 				{
				// 					title: 'Button',
				// 					page: '/material/buttons-and-indicators/button'
				// 				},
				// 				{
				// 					title: 'Button toggle',
				// 					page: '/material/buttons-and-indicators/button-toggle'
				// 				},
				// 				{
				// 					title: 'Chips',
				// 					page: '/material/buttons-and-indicators/chips'
				// 				},
				// 				{
				// 					title: 'Icon',
				// 					page: '/material/buttons-and-indicators/icon'
				// 				},
				// 				{
				// 					title: 'Progress bar',
				// 					page: '/material/buttons-and-indicators/progress-bar'
				// 				},
				// 				{
				// 					title: 'Progress spinner',
				// 					page: '/material/buttons-and-indicators/progress-spinner'
				// 				},
				// 				{
				// 					title: 'Ripples',
				// 					page: '/material/buttons-and-indicators/ripples'
				// 				}
				// 			]
				// 		},
				// 		{
				// 			title: 'Popups & Modals',
				// 			bullet: 'dot',
				// 			submenu: [
				// 				{
				// 					title: 'Bottom sheet',
				// 					page: '/material/popups-and-modals/bottom-sheet'
				// 				},
				// 				{
				// 					title: 'Dialog',
				// 					page: '/material/popups-and-modals/dialog'
				// 				},
				// 				{
				// 					title: 'Snackbar',
				// 					page: '/material/popups-and-modals/snackbar'
				// 				},
				// 				{
				// 					title: 'Tooltip',
				// 					page: '/material/popups-and-modals/tooltip'
				// 				}
				// 			]
				// 		},
				// 		{
				// 			title: 'Data table',
				// 			bullet: 'dot',
				// 			submenu: [
				// 				{
				// 					title: 'Paginator',
				// 					page: '/material/data-table/paginator'
				// 				},
				// 				{
				// 					title: 'Sort header',
				// 					page: '/material/data-table/sort-header'
				// 				},
				// 				{
				// 					title: 'Table',
				// 					page: '/material/data-table/table'
				// 				}
				// 			]
				// 		}
				// 	]
				// },
				// {
				// 	title: 'Ng-Bootstrap',
				// 	root: true,
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-digital-marketing',
				// 	submenu: [
				// 		{
				// 			title: 'Accordion',
				// 			page: '/ngbootstrap/accordion'
				// 		},
				// 		{
				// 			title: 'Alert',
				// 			page: '/ngbootstrap/alert'
				// 		},
				// 		{
				// 			title: 'Buttons',
				// 			page: '/ngbootstrap/buttons'
				// 		},
				// 		{
				// 			title: 'Carousel',
				// 			page: '/ngbootstrap/carousel'
				// 		},
				// 		{
				// 			title: 'Collapse',
				// 			page: '/ngbootstrap/collapse'
				// 		},
				// 		{
				// 			title: 'Datepicker',
				// 			page: '/ngbootstrap/datepicker'
				// 		},
				// 		{
				// 			title: 'Dropdown',
				// 			page: '/ngbootstrap/dropdown'
				// 		},
				// 		{
				// 			title: 'Modal',
				// 			page: '/ngbootstrap/modal'
				// 		},
				// 		{
				// 			title: 'Pagination',
				// 			page: '/ngbootstrap/pagination'
				// 		},
				// 		{
				// 			title: 'Popover',
				// 			page: '/ngbootstrap/popover'
				// 		},
				// 		{
				// 			title: 'Progressbar',
				// 			page: '/ngbootstrap/progressbar'
				// 		},
				// 		{
				// 			title: 'Rating',
				// 			page: '/ngbootstrap/rating'
				// 		},
				// 		{
				// 			title: 'Tabs',
				// 			page: '/ngbootstrap/tabs'
				// 		},
				// 		{
				// 			title: 'Timepicker',
				// 			page: '/ngbootstrap/timepicker'
				// 		},
				// 		{
				// 			title: 'Tooltips',
				// 			page: '/ngbootstrap/tooltip'
				// 		},
				// 		{
				// 			title: 'Typehead',
				// 			page: '/ngbootstrap/typehead'
				// 		}
				// 	]
				// },
				// {section: 'Applications'},
				// {
				// 	title: 'eCommerce',
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-list-2',
				// 	root: true,
				// 	permission: 'accessToECommerceModule',
				// 	submenu: [
				// 		{
				// 			title: 'Customers',
				// 			page: '/ecommerce/customers'
				// 		},
				// 		{
				// 			title: 'Products',
				// 			page: '/ecommerce/products'
				// 		},
				// 	]
				// },
				// {
				// 	title: 'User Management',
				// 	root: true,
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-user-outline-symbol',
				// 	submenu: [
				// 		{
				// 			title: 'Users',
				// 			page: '/user-management/users'
				// 		},
				// 		{
				// 			title: 'Roles',
				// 			page: '/user-management/roles'
				// 		}
				// 	]
				// },
				// {section: 'Custom'},
				// {
				// 	title: 'Error Pages',
				// 	root: true,
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-list-2',
				// 	submenu: [
				// 		{
				// 			title: 'Error 1',
				// 			page: '/error/error-v1'
				// 		},
				// 		{
				// 			title: 'Error 2',
				// 			page: '/error/error-v2'
				// 		},
				// 		{
				// 			title: 'Error 3',
				// 			page: '/error/error-v3'
				// 		},
				// 		{
				// 			title: 'Error 4',
				// 			page: '/error/error-v4'
				// 		},
				// 		{
				// 			title: 'Error 5',
				// 			page: '/error/error-v5'
				// 		},
				// 		{
				// 			title: 'Error 6',
				// 			page: '/error/error-v6'
				// 		},
				// 	]
				// },
				// {
				// 	title: 'Wizard',
				// 	root: true,
				// 	bullet: 'dot',
				// 	icon: 'flaticon2-mail-1',
				// 	submenu: [
				// 		{
				// 			title: 'Wizard 1',
				// 			page: '/wizard/wizard-1'
				// 		},
				// 		{
				// 			title: 'Wizard 2',
				// 			page: '/wizard/wizard-2'
				// 		},
				// 		{
				// 			title: 'Wizard 3',
				// 			page: '/wizard/wizard-3'
				// 		},
				// 		{
				// 			title: 'Wizard 4',
				// 			page: '/wizard/wizard-4'
				// 		},
				// 	]
				// },
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
