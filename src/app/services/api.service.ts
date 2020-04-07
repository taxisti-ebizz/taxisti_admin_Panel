import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    path = 'api/';

    login = this.path+'adminLogin';
}
