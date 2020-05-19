import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Multi Select Dropdown
import { IDropdownSettings } from 'ng-multiselect-dropdown';

//Services
import { ApiService } from '../../../../services/api.service';
import { HttpService } from '../../../../services/http.service';

//Spinner
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(private formBuilder: FormBuilder,
    private http : HttpService,
    private api : ApiService,
    private spinner : NgxSpinnerService) { }

  ngOnInit() {
    this.getDriverList();
    this.selectedItems = [];
    this.dropdownSettings = {
        singleSelection: false,
        idField: 'driver_id',
        textField: 'driver_name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: this.ShowFilter
    };
    this.logDetailsForm = this.formBuilder.group({
        driver_id: ['',Validators.required],
        duration : ['Day'],
        time : ['']
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
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
      console.log('onSelectAll', items);
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

  }

}
