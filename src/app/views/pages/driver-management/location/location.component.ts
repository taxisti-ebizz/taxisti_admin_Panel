import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SubheaderService } from '../../../../core/_base/layout';

// Env
import { environment } from '../../../../../environments/environment';

import * as firebase from 'firebase';


export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};


@Component({
  selector: 'kt-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  donors = [];

  lat : any;
  lng : any;

  constructor(private subheaderService: SubheaderService){
    // if (navigator)
    // {
    //   navigator.geolocation.getCurrentPosition( pos => {
    //     this.lng = +pos.coords.longitude;
    //     this.lat = +pos.coords.latitude;
    //   });
    // }

    firebase.initializeApp(environment.firebaseConfig);

    firebase.database().ref('userData1/').on('value', resp => {
      this.donors = [];

      this.donors = snapshotToArray(resp);
     
      this.donors.forEach(element => {
        element.icon = 'assets/img/car_img.png';
      });
    });
    // this.initMap();
  }

  ngOnInit() {
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Driver Management');
    
  }
}
