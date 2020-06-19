import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SubheaderService } from '../../../../core/_base/layout';

//Http API Method
import { HttpService } from '../../../../services/http.service';

//Ngx Spinner
import { NgxSpinnerService } from 'ngx-spinner';

//Toastr Messages
import { ToastrService } from 'ngx-toastr';

//API Service
import { ApiService } from '../../../../services/api.service';
import { MapLoaderService } from '../../../../services/ride-area/map-loader.service'
import { tap, finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

declare var google: any;

@Component({
  selector: 'kt-add-ride-area',
  templateUrl: './add-ride-area.component.html',
  styleUrls: ['./add-ride-area.component.scss']
})
export class AddRideAreaComponent implements OnInit {

    areaDetailForm: FormGroup;

    lat = 32.882792;
    lng = 13.189537;
    map: any;
    poly : any;
    drawingManager: any;
    coordinates = [];
    loading = false;
    hasFormErrors = false;

    constructor(private api : ApiService, 
      private http : HttpService,
      private subheaderService: SubheaderService,
      private formBuilder: FormBuilder,
      private router: Router,
      private spinner : NgxSpinnerService,
      private activatedRoute: ActivatedRoute,
      private toastr : ToastrService) { }

    ngOnInit() {
       // Set title to page breadCrumbs
       this.subheaderService.setTitle('Ride Area Settings');

       this.areaDetailForm = this.formBuilder.group({
          area_name: ['', Validators.required],
       });
    }

    ngAfterViewInit() {
      MapLoaderService.load().then(() => {
        this.drawPolygon();
      })
    }
    
    //Draw Polygon
    drawPolygon() {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 8
      });
  
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['polygon']
        },
        polygonOptions: {
          strokeColor: "#e80c51",
          fillColor : "#e3caca",
          fillOpacity: 0.8
        },
      });
  
      this.drawingManager.setMap(this.map);
      google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (event) => {
        // Polygon drawn
        // if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        //   //this is the coordinate, you can assign it to a variable or pass into another function.
        //   alert(event.overlay.getPath().getArray());

        //   console.log("getPath =======>>>>>>",event.overlay.getPath());
          
          
        //   this.getCoordinates(event.overlay.getPath().getArray())
          
          
        // }

        const len = event.getPath().getLength();

        for (let i = 0; i < len; i++) {
          const vertex = event.getPath().getAt(i);
          const vertexLatLng = {"lat": vertex.lat(), "lng": vertex.lng()};
          this.coordinates.push(vertexLatLng);
        }
        // the last point of polygon should be always the same as the first point (math rule)
        //this.coordinates.push(this.coordinates[0]);
      });
    }

    //Add Area
    submit(formData): void {
      
      const controls = this.areaDetailForm.controls;

      /** check form */
      if (this.areaDetailForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );
        return;
      }

	  	this.loading = true;

      const data = {
        'area_name' : formData.area_name,
        'coordinates' : JSON.stringify(this.coordinates) 
      }  

      this.http
			.postReq(this.api.addAreaBoundaries,data)
			.pipe(
				tap(result => {
					
					if (result.status == true) {
              this.spinner.hide();
              this.router.navigateByUrl('/ride-area-settings/ride-area-list', { relativeTo: this.activatedRoute });
          }
          else{
            this.spinner.hide();
            this.toastr.error('Something went wrong');
          }
				}),
				finalize(() => {
					this.loading = false;
				})
			).subscribe();
     
    }


    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.areaDetailForm.controls[controlName];
      if (!control) {
        return false;
      }

      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }
}
