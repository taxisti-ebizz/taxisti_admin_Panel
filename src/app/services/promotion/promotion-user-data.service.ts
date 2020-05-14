import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PromotionUser } from '../../module/promotion/promotion-user.module';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../http.service';
import { ApiService } from './../api.service'

@Injectable({
  providedIn: 'root'
})
export class PromotionUserDataService {
  
  dataChange : BehaviorSubject<PromotionUser[]> = new BehaviorSubject<PromotionUser[]>([]);

  mode = 0;
  obj = {};
  dialogData : any;
  page = 0;
  count = 0;
  total : any;

  constructor(private httpClient : HttpClient,
    private spinner : NgxSpinnerService,
    private http : HttpService,
    private api : ApiService) { }

    get data() : PromotionUser[] {
      return this.dataChange.value
    }
  
    //Redeem Coupon
    redeemCoupon(index){
      const foundIndex = this.dataChange.value.findIndex(x => x.id === index);
  
      this.dataChange.value.splice(foundIndex, 1);
      
      this.dataChange.next(this.dataChange.value);
    }
  
    //Get Promotion User Data
    getPromotionUserList(page) : void {
      this.spinner.show();
  
      const data = {
        "page" : page
      }
  
      const headers : HttpHeaders = new HttpHeaders({ Authorization : 'Bearer '+localStorage.getItem('token') })
     
      this.httpClient.post<PromotionUser>(this.http.baseUrl+this.api.getUserPromotionList,data,{ headers }).subscribe(res => {
          const result : any = res;
  
          if(result.status == true){
  
            if(Object.keys(result.data).length > 0 && result.data.constructor === Object){
              var i = 1;
              result.data.data.forEach(element => {
                element.index = i;
                i++;
              });
  
              this.total = result.data.total;
              this.dataChange.next(result.data.data);
              
            }
          }
  
          this.spinner.hide();
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
    }
  
    // DEMO ONLY, you can find working methods below
    add (data: PromotionUser): void {
      this.dialogData = data;
    }
  
    update (data: PromotionUser): void {
      this.dialogData = data;
    }
  
    delete (id: number): void {
      console.log(id);
    }
  
    getDialogData() {
      return this.dialogData;
    }  
}
