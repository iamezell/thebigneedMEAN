'use strict';

var angular = require('angular'); // That's right! We can just require angular as if we were in node

// var app = angular.module('thebigneed', []);

// app.controller('HelloCtrl', function($scope) {
//   $scope.test = 'Test varretjes';
// });
var dives = [
  {
    site: 'Abu Gotta Ramada',
    location: 'Hurghada, Egypt',
    depth: 72,
    time: 54
  },
  {
    site: 'Ponte Mahoon',
    location: 'Maehbourg, Mauritius',
    depth: 54,
    time: 38
  },
  {
    site: 'Molnar Cave',
    location: 'Budapest, Hungary',
    depth: 98,
    time: 62
  }];


	angular.module('diveLog', [])
      .controller('diveLogCtrl', DiveLogCtrl);

    function DiveLogCtrl($scope) {
      $scope.dives = dives;
      console.log($scope);
    }