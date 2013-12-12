'use strict';

var baseApp = angular.module('baseApp', ['ngRoute', "ngProgress","uiSlider", "ngResource"]);

baseApp.directive('myDropdown', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            type: '@'
        },
        controller: function($scope) {
            $scope.show = false;
            $scope.showDropdown = function() {
                $scope.show = !$scope.show;
            };
        },
        templateUrl: '/static/my-dropdown.html'
    };
});

baseApp.service('loginService', function($http){
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
});



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

baseApp.controller('loginController', function($scope, $http, loginService) {
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

});

baseApp.controller('signinController', function($scope, $http) {
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
});

baseApp.controller('SongSearchCtrl', function($scope, $http, $document, loginService) {
	$scope.songsList = [];
	$scope.playList = [];
	$scope.songNumber = 0;
	$scope.loadedLists = [];
    $scope.logged = new Object();
	$scope.logged.show = false;
	$scope.logged.name = "";
	$scope.songSelection = false;
	$scope.playListBool = false;
	$scope.songBeingPlayed = 0;
	$scope.activeSong = false;

    var baseUrl = "/musicshare/";
	
	var audio = $document.find('audio')[0]
	var fileInput = document.getElementById('fileInput')
	
	$scope.search = function(description) {
		$scope.transmit = description
		$http.post(baseUrl, description).success(function(data) {
			//console.log(data);
			if (data != "false") {	
				$scope.songs = data;
				$scope.songSelection = true;
			};
		});
	};
	
	$scope.addSong = function(aSong) {
        //aSong.value = "music_down/" + aSong.value;
        //aSong = JSON.parse(JSON.stringify(aSong));
		$scope.songsList.push(aSong);
		$scope.songNumber++;
		audio.autoplay = false
		if ($scope.songNumber == 1) {
			$scope.activeSong = $scope.songsList[0];
		};
	};
	
	$scope.remSong = function(aSong) {
		var index = $scope.songsList.indexOf(aSong);
		if (index != -1){
			$scope.songsList.splice(index, 1);
			$scope.songNumber--;
		};

	};
	
	$scope.saveList = function() {
		var name = window.prompt("Please name the list", "something");
		//console.log("data");
		//name = "zzz";
		$http.post(baseUrl + 'playlist/', [name, $scope.songsList]).success(function(data) {
			if (data == "true") {
				$scope.getLists();
			}
		});
	};
	
	$scope.clearList = function() {
		$scope.songsList = [];
		$scope.songNumber = 0;
	};
	
	
	$scope.getLists = function() {
		$http.get(baseUrl + '/playlist/').success(function(data) {
			//console.log(data);
			if (data != "None") {
				$scope.loadedLists = data;
				$scope.playListBool = true;
			} else {
				$scope.playListBool = false;
			}
		});
	};
	
	$scope.loadList = function(aList) {
        $http.post(baseUrl + '/rplaylist/', aList[0]).success(function(data) {
            
            $scope.songsList = data;
            $scope.songNumber = $scope.songsList.length;
            $scope.songBeingPlayed = 0;
            $scope.changeSong();
            audio.autoplay = false
	    });	
	};
	
	$scope.dropList = function(aList) {
		var name = window.prompt("Verify the name of list to drop", "");
		if (name == aList[1]) {
			$http.delete(baseUrl + '/playlist/?id=' + aList[0]).success(function() {
				var msg = aList[1] + " successfully dropped";
				window.alert(msg);
				$scope.getLists();
			});
		}
	}
	

	
	fileInput.addEventListener("change", function() {
		var reader = new FileReader()
		var files = fileInput.files;
		if (files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				reader.readAsBinaryString(files[i])
				if (i == files.length - 1) {
					reader.onloadend = (function() { 
						// console.log(reader.result);
						$http({withCredentials: true, method: "post", url: baseUrl + "/upload/", data: reader.result}).success(function(data) {
							$scope.getLists();
                            //console.log(fileInput.files);
                            fileInput.value = null;
                            //console.log(fileInput.files);
						});
					});
				} else {
					reader.onloadend = (function() { 
						// console.log(reader.result);
						$http({withCredentials: true, method: "post", url: baseUrl + "/upload/", data: reader.result})
					});
				}
			}
		}
	});
	
	audio.addEventListener('ended', function() {
		audio.autoplay = true
		$scope.$apply($scope.nextSong());
	});
	
	$scope.moveDown = function(aSong) {
		var index = $scope.songsList.indexOf(aSong);
		if (index < $scope.songNumber - 1){
			$scope.songsList.splice(index+1, 0, $scope.songsList.splice(index, 1)[0]);
		}
	};
	
	$scope.moveUp = function(aSong) {
		var index = $scope.songsList.indexOf(aSong);
		if (index > 0){
			$scope.songsList.splice(index-1, 0, $scope.songsList.splice(index, 1)[0]);
			// var downedSong = $scope.songsList.splice(index-1, 1)[0];
			// console.log($scope.songsList[index],$scope.songsList[index-1]);
			// $scope.songsList[index] = downedSong;
			// $scope.songsList[index-1] = uppedSong;
		}
	};
	
	$scope.prevSong = function() {
		if ($scope.songBeingPlayed > 0) {
			$scope.songBeingPlayed--;
			$scope.changeSong();
			audio.autoplay = true
		};
	};
	
	$scope.nextSong = function() {
		if ($scope.songBeingPlayed < $scope.songNumber - 1) {
			$scope.songBeingPlayed++;
			$scope.changeSong();
			audio.autoplay = true;
		} else {
			$scope.songBeingPlayed = 0
			$scope.changeSong();
			audio.autoplay = false;
		}
	};
	
	$scope.changeSong = function() {

		$scope.activeSong = $scope.songsList[$scope.songBeingPlayed];
	};

    loginService.init(baseUrl + 'login/', function(data){
        if(data != "None") {
            $scope.logged.show = true;
            $scope.logged.name = data;
            $scope.getLists();
        } else {
            $scope.logged.show = false;
        }
    });

    loginService.connectCallBack = function(){
        $scope.logged.show = true;
        $scope.getLists();
    }

    loginService.disconnectCallBack = function() {
        $scope.logged.show = false;
        $scope.loadedLists = [];
    }
	
});

baseApp.controller("SongSelectionCtrl", function ($scope, $http, ngProgress, loginService) {
    $scope.autoVolumeChangeInProgress = false;

    $scope.artists = [];
    $scope.albums = [];
    $scope.songs = [];
    $scope.output = null; 
    $scope.metadata = new Object(null);
    $scope.paused = false;
    $scope.songList = new Object(null);
    $scope.volume = null;
    var baseUrl = '/pimusic';

    var ws = new WebSocket("ws://" + document.domain + ":5000/api");
    ws.onopen = function() {
        $scope.$watch('volume', function() {
            if (!$scope.autoVolumeChangeInProgress && $scope.volume != "NaN") {
                ws.send("volume:" + parseInt($scope.volume) + "\n");
            }
        });
    }

    $scope.playSong = function(songDetails) {
        var url = baseUrl + '/music/' + songDetails[3] + '/' + songDetails[2] + '/' + songDetails[0];
        $http.post(url, songDetails);
    }

    $scope.getSongs = function(albumDetails){
        $http.get(baseUrl + '/music/' + albumDetails[2] + '/' + albumDetails[0]).success(function(data){
            $scope.songs = data;
        });
    }

    $scope.getAlbums = function(artistDetails) {
        $http.get(baseUrl + '/music/' + artistDetails[0]).success(function(data) {
            $scope.albums = data;
        });
    }

    $scope.pause_unpause = function() {
        $http.get(baseUrl + '/player/pause');
    }

    $scope.nextSong = function() {
        $http.get(baseUrl + '/player/next');
    }

    $scope.prevSong = function(){
        $http.get(baseUrl + '/player/previous');
    }

    var mplayerParse = function(socketOutput) {
        switch(socketOutput.message)
        {
        case "ANS_PERCENT_POSITION":
            $scope.output = socketOutput.value;
            ngProgress.set(parseInt(socketOutput.value));
            break;
        case "Title":
        case "ANS_META_TITLE":
            $scope.metadata.title = socketOutput.value;
            break;
        case "Artist":
        case "ANS_META_ARTIST":
            $scope.metadata.artist = socketOutput.value;
            break;
        case "Album":
        case "ANS_META_ALBUM":
            $scope.metadata.album = socketOutput.value;
            break;
        case "ANS_pause":
            if (socketOutput.value == "yes") {
                $scope.paused = true;
            } else {
                $scope.paused = false;
            }
            break;
        case "list":
            $scope.songList.list = socketOutput.value;
            break;
        case "index":
            $scope.songList.index = socketOutput.value;
            break;
        case "ANS_volume":
            $scope.autoVolumeChangeInProgress = true;
            $scope.volume = socketOutput.value;
            break;
        default:
            console.log("Unknown: %s", socketOutput.message);
        }
        $scope.$apply();

        $scope.autoVolumeChangeInProgress = false;
    }

    var init = function () {
        $http.get(baseUrl + '/music').success(function(data) {
            $scope.artists = data;
        });

        ws.onmessage = function(msg) {
            console.log("Received message: %s", msg.data);
            mplayerParse(JSON.parse(msg.data));
        }
    }
    init();

    loginService.init('/musicshare/login/', function(data){});
    loginService.connectCallBack = function(){};
    loginService.disconnectCallBack = function(){};
});
