import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Multi Select Dropdown
import { IDropdownSettings } from 'ng-multiselect-dropdown';

//Services
import { ApiService } from '../../../../services/api.service';
import { HttpService } from '../../../../services/http.service';

//Spinner
import { NgxSpinnerService } from 'ngx-spinner';
import { map, tap, finalize } from 'rxjs/operators';

import { DatePipe } from '@angular/common'; // Used for changed date format
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { SubheaderService } from '../../../../core/_base/layout';

@Component({
  selector: 'kt-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss']
})
export class LogDetailsComponent implements OnInit {

  logDetailsForm:FormGroup;

  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  drivers : any = [];
  selectedItems : any = [];
  dropdownSettings: any = {};

  hasFormErrors = false;
  viewLoading = false;
  loading = false;
  maxDate: Date;
  year : Date;

  resultArray = [];
  total_hour : any;

  //Date Range Picker
  ranges: any = [{
    value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
    label: 'Last 7 Days'
  }, {
    value: [new Date(), new Date(new Date().setDate(new Date().getDate() + 7))],
    label: 'Next 7 Days'
  }];
  
  //Month Selection
  bsValue: Date = new Date(new Date().getFullYear(), new Date().getMonth());
  minMode: BsDatepickerViewMode = 'month';
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private formBuilder: FormBuilder,
    private http : HttpService,
    private api : ApiService,
    private spinner : NgxSpinnerService,
    private datePipe : DatePipe,
    private subheaderService: SubheaderService) { }

  ngOnInit() {
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Driver Online Log');

    this.getDriverList();
    this.selectedItems = [];
    this.dropdownSettings = {
        singleSelection: true,
        idField: 'driver_id',
        textField: 'driver_name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
    };
    this.logDetailsForm = this.formBuilder.group({
        driver_id : ['',Validators.required],
        duration : ['Day']
    });  
  }

  getDriverList(){

    const data = {
      type : 'select'
    }

    this.http.postReq(this.api.getDriverList,data).subscribe(res => {
        const result : any = res;
        if(result.status == true)
        {
          this.drivers = result.data;
          this.spinner.hide();
        }
    })
  }

  onItemSelect(item: any) {
    console.log('onItemSelect ====>>>>>>>', item);
  }
 
  toogleShowFilter() {
      this.ShowFilter = !this.ShowFilter;
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
      if (this.limitSelection) {
          this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
      } else {
          this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
      }
  }

  updateDetails(formData){

    if(formData.duration == 'Day'){

      var timeValue = (<HTMLInputElement>document.getElementById('dayTime')).value;

    }else if(formData.duration == 'Week'){

      var week = (<HTMLInputElement>document.getElementById('weekTime')).value;
      week = ""+week.toString()+"";

      var timeValue = week.replace(/\s+-/g, '');
  
    }else if(formData.duration == 'Month'){

      var timeValue = (<HTMLInputElement>document.getElementById('monthTime')).value;

    }else if(formData.duration == 'Year'){

      var timeValue = (<HTMLInputElement>document.getElementById('yearTime')).value;

    }

    this.loading = true;

    const data = {
      'driver_id' : formData.driver_id[0].driver_id,
      'duration' : formData.duration,
      'time' : timeValue
    }

    this.http.postReq(this.api.getDriverOnlineLog,data)
    .pipe(
      tap(result => {
        var x = document.getElementById('reportData');
            x.style.display = "block";

        if(result.status == true)
        {
          this.resultArray = result.data;
          this.total_hour = result.total_hour;
          this.spinner.hide();
          this.loading = false;
        } 
        else{
          
          this.total_hour = result.total_hour;
          this.spinner.hide();
          this.loading = false;
        } 
      }),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe();
  }

  //Change Date Format
  changeDateFormat(myDate) {
    return this.datePipe.transform(myDate, 'yyyy-MM-dd');
  }
  
  //Change Duration
  changeDuration(value){

    var d = document.getElementById('dayTime');
        d.style.display = 'none';

    var w = document.getElementById('weekTime');
        w.style.display = 'none'; 

    var m = document.getElementById('monthTime');
        m.style.display = 'none';

    var y = document.getElementById('yearTime');
        y.style.display = 'none';

    var att = document.createAttribute("formControlName");       // Create a "class" attribute
        att.value = "time";                     // Set the value of the class attribute    

    if(value == 'Day'){

        d.style.display = 'block';  

    }else if(value == 'Week'){

        w.style.display = 'block';
      
    }else if(value == 'Month'){

        m.style.display = 'block';
      
    }else if(value == 'Year'){

        y.style.display = 'block';

    }
    
  }

  //Month & Year selection
  onMonthYear(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };     
    container.setViewMode('month');
  }

  //Year Selection
  onYear(container) {
    container.yearSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };     
    container.setViewMode('year');
  }

}
