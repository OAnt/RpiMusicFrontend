'use strict';

var myApp = angular.module('baseApp', []);

myApp.service('loginService', function(){
    this.connect = function(user) {
        if( user != undefined){
			$http({withCredentials: true, method: "post", url: baseUrl + "/login/", data: user}).success(function(data) {
				if(data == "False") {
                    return null;
				}
				else {
                    return user.name;
				}
			});
		}
    };

    this.logout = function(){
		$http.get(baseUrl + '/logout/')
    }
}
