import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import  { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router : Router,private authService : AdminAuthService) { }

  canActivate() {
    if(this.authService.loggedIn()){
      return true;
    }
    else{
      this.router.navigate(['/']);
      return false;
    }
}
}
