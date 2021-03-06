'use strict';

var baseApp = angular.module('baseApp', ['ngRoute', "ngProgress","uiSlider", "ngResource"]);

baseApp.directive('myDropdown', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            type: '@'
        },
        controller: ['$scope', function($scope) {
            $scope.show = false;
            $scope.showDropdown = function() {
                $scope.show = !$scope.show;
            };
        }],
        templateUrl: '/static/my-dropdown.html'
    };
});

baseApp.service('loginService', ['$http', function($http){
    this.connectCallBack = function(){};
    this.connect = function(connUrl, user, callback) {
        var name = null;
        var controllerCallBack = this.connectCallBack;
        if( user != undefined){
			$http({withCredentials: true, method: "post", url: connUrl, data: user}).success(function(data) {
				if(data == "True") {
                    name = user.name;
				}
                callback(name);
                controllerCallBack();
			});
		}
    };
    this.disconnectCallBack = function(){};
    this.disconnect = function(deconnUrl){
		$http.get(deconnUrl);
        this.disconnectCallBack();
    };
    this.init = function(isConnUrl, callback){
        $http.get(isConnUrl).success(callback);
    };
}]);



baseApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/summary.html'
            }).
            when('/pimusic', {
                templateUrl: 'pimusic/',
                controller: 'SongSelectionCtrl'
            }).
            when('/musicshare', {
                templateUrl: 'musicshare/',
                controller: 'SongSearchCtrl'
            });
        $locationProvider.html5Mode(true);
    }
]);

baseApp.controller('loginController', ['$scope', '$http', 'loginService', function($scope, $http, loginService) {
    $scope.loginWindow = false;
    $scope.error = null;
    $scope.logged = new Object();
    $scope.logged.loggedin = false;
    $scope.logged.name = null;
    
    var baseUrl = '/musicshare/';
    
    $scope.showWindow = function() {
        $scope.loginWindow =!($scope.loginWindow);
        $scope.error = null;
    }

    $scope.login = function(user) {
        loginService.connect(baseUrl + 'login/', user, function(name){
            if (name == null) {
                $scope.error = "Login Error";
            } else {
                $scope.loginWindow = false;
                $scope.logged.loggedin = true;
                $scope.error = null;
            }
            $scope.logged.name = name;
            user = null;
        });
    }

    $scope.logout = function() {
        loginService.disconnect(baseUrl + 'logout/');
        $scope.logged.loggedin = false;
        $scope.logged.name = null;
        $scope.error = null;
    }

    loginService.init(baseUrl + 'login/', function(data) {
        if(data != "") {
            $scope.logged.loggedin = true;
            $scope.logged.name = data;
        } else {
            $scope.logged.loggedin = false;
        }
    });
    loginService.connectCallBack = function(){};
    loginService.disconnectCallBack = function(){};

}]);

baseApp.controller('signinController',['$scope', '$http',  function($scope, $http) {
	$scope.signinForm = new Object();
	$scope.signinForm.show = "false";
    $scope.error = null;
	
        var baseUrl = "/musicshare/";
	$scope.signin = function() {
		if ($scope.signinForm.show) {
			$scope.signinForm.show = false;
		} else {
			$scope.signinForm.show = true;
		}
	};
	
	$scope.sign = function(user) {
			if (user != undefined && user.name != undefined && user.password != undefined && user.password == user.passwordConf){
				var userData = new Object();
				userData.name = user.name;
				userData.password = user.password;
				$http({withCredentials: true, method: "post", url: baseUrl + "/signin/", data: userData}).success(function(data) {
					if (data == "true") {
						$scope.error = null;
						$scope.signinForm.show = "false";
						var msg = user.name + " successfully registered";
						window.alert(msg);
						user.name = "";
						user.password = "";
						user.passwordConf = "";
					} else {
						$scope.error = "User already exists";
						user.name = "";
						user.password = "";
						user.passwordConf = "";
					}
				});
			} else {
				$scope.error = "Identification error";
			}
	};
}]);

