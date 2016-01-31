
var angular = require('angular');


global.angular = angular;




var app = angular.module('tbn', [require('angular-route')]);
var landingController = require('./landing/landingController');
var signinController = require('./signin/signinController');
var regiController = require('./register/regiController');

app.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl:"templates/home.html",
		controller: landingController

	}).when('/signin', {
		templateUrl:"templates/signin.html",
		controller: signinController
	}).when('/register', {
		templateUrl:"templates/regi.html",
		controller: regiController
	})

	.otherwise({redirectTo:'/'});

});

app.controller('landingController', ['$scope', landingController])
app.controller('signinController', ['$scope', signinController])
app.controller('regiController', ['$scope', regiController])
	


