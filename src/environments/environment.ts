// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',

  // firebaseConfig : {
  //   apiKey: "AIzaSyB9pnqJDpeqtfTQqiC5eiulPN5aLnOg3J8", //OLD ===> AIzaSyDPKHXnfTbkIqJTFNGWpTvt4MCyebb5DeE
  //   authDomain: "taxistinewproject.firebaseapp.com",
  //   databaseURL: "https://taxistinewproject.firebaseio.com",
  //   projectId: "taxistinewproject", //taxisti-8392c
  //   storageBucket: "taxistinewproject.appspot.com",
  //   messagingSenderId: "823803868309" //OLD ===> 1007628796907
  // }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
