import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  type = '';
  constructor(private router: Router,
    private toastr: ToastrService) { }

  logout() {
    console.log("Hello====>>>");
    
    this.toastr.success("Logout Successfully");
    localStorage.clear();
    this.router.navigate(['/login']);
    
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}
