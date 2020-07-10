import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SubheaderService } from '../../../../core/_base/layout';

// Env
// import { environment } from '../../../../../environments/environment';

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


const firebaseConfig = {
  apiKey: "AIzaSyB9pnqJDpeqtfTQqiC5eiulPN5aLnOg3J8", //OLD ===> AIzaSyDPKHXnfTbkIqJTFNGWpTvt4MCyebb5DeE
  authDomain: "taxistinewproject.firebaseapp.com",
  databaseURL: "https://taxistinewproject.firebaseio.com",
  projectId: "taxistinewproject", //taxisti-8392c
  storageBucket: "taxistinewproject.appspot.com",
  messagingSenderId: "823803868309" //OLD ===> 1007628796907
}

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

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

    firebase.database().ref('userData1/').on('value', resp => {

      this.donors = [];

      this.donors = snapshotToArray(resp);
    
      this.donors.forEach(element => {
        element.icon = 'assets/img/car_img.png';
      });
    });

    //this.initMap();
        
      
  }

  ngOnInit() {
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Driver Management');
    
  }
}
