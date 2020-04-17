// Angular
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
// AppState
import { AppState } from '../../../core/reducers';
// Auth
import { Permission } from '../../../core/auth';

@Component({
  selector: 'kt-user-list-management',
  templateUrl: './user-list-management.component.html',
  styleUrls: ['./user-list-management.component.scss']
})
export class UserListManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
