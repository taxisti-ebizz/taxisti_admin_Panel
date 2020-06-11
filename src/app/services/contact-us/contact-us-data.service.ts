import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContactUs } from '../../module/contact-us/contact-us.module';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class ContactUsDataService {

  dataChange : BehaviorSubject<ContactUs[]> = new BehaviorSubject<ContactUs[]>([]);

  mode = 0;
  obj = {};
  dialogData : any;
  page = 0;
  count = 0;
  total : any;
  formData = {};

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

  get data() : ContactUs[] {
    return this.dataChange.value
  }

  //Delete single contact
  deleteContact(index){
    const foundIndex = this.dataChange.value.findIndex(x => x.id === index);

    this.dataChange.value.splice(foundIndex, 1);
    
    this.dataChange.next(this.dataChange.value);
  }

  //Get Contact List Data
  getContactUsList(page) : void {
    this.spinner.show();

    var data = {};

    if(localStorage.getItem('contactUsFilter')!=null && localStorage.getItem('contactUsFilter')!=''){
      data = {
        "page" : page,
        "type" : "filter",
        "filter" : localStorage.getItem('contactUsFilter')
      }
    }else{
      data = {
        "page" : page
      }
    }

    const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
   
    this.httpClient.post<ContactUs>(this.http.baseUrl+this.api.getContactUsList,data,{ headers }).subscribe(res => {
        const result : any = res;

        if(result.status == true){

          if(Object.keys(result.data).length > 0 && result.data.constructor === Object){
            var i = 1;
            result.data.data.forEach(element => {
              element.index = i;
              i++;
            });

            this.total = result.data.total;
            setTimeout(() => {
              this.dataChange.next(result.data.data);
              this.spinner.hide();
            }, 500);
          }
        }
        else{
          this.total = 0;
          setTimeout(() => {
            this.dataChange.next([]);
            this.spinner.hide();
          }, 500);
        }
    },
    (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  delete (id: number): void {
    console.log(id);
  }

  getDialogData() {
    return this.dialogData;
  }
}
