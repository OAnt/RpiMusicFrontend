/*
ngProgress 1.0.3 - slim, site-wide progressbar for AngularJS 
(C) 2013 - Victor Bjelkholm 
License: MIT 
Source: https://github.com/VictorBjelkholm/ngProgress 
Date Compiled: 2013-09-13 
*/
angular.module('ngProgress.provider', ['ngProgress.directive'])
    .provider('ngProgress', function () {
        'use strict';
        //Default values for provider
        this.autoStyle = true;
        this.count = 0;
        this.height = '2px';
        this.color = 'firebrick';

        this.$get = ['$document',
            '$window',
            '$compile',
            '$rootScope',
            '$timeout', function ($document, $window, $compile, $rootScope, $timeout) {
            var count = this.count,
                height = this.height,
                color = this.color,
                $scope = $rootScope,
                $body = $document.find('body');

            // Compile the directive
            var progressbarEl = $compile('<ng-progress></ng-progress>')($scope);
            // Add the element to body
            $body.append(progressbarEl);
            // Set the initial height
            $scope.count = count;
            // If height or color isn't undefined, set the height, background-color and color.
            if (height !== undefined) {
                progressbarEl.eq(0).children().css('height', height);
            }
            if (color !== undefined) {
                progressbarEl.eq(0).children().css('background-color', color);
                progressbarEl.eq(0).children().css('color', color);
            }
            // The ID for the interval controlling start()
            var intervalCounterId = 0;
            return {
                // Starts the animation and adds between 0 - 5 percent to loading
                // each 400 milliseconds. Should always be finished with progressbar.complete()
                // to hide it
                start: function () {
                    // TODO Use requestAnimationFrame instead of setInterval
                    // https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame
                    this.show();
                    var self = this;
                    intervalCounterId = setInterval(function () {
                        if (isNaN(count)) {
                            clearInterval(intervalCounterId);
                            count = 0;
                            self.hide();
                        } else {
                            var remaining = 100 - count;
                            count = count + (0.15 * Math.pow(1 - Math.sqrt(remaining), 2));
                            self.updateCount(count);
                        }
                    }, 200);
                },
                updateCount: function (new_count) {
                    $scope.count = new_count;
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                },
                // Sets the height of the progressbar. Use any valid CSS value
                // Eg '10px', '1em' or '1%'
                height: function (new_height) {
                    if (new_height !== undefined) {
                        height = new_height;
                        $scope.height = height;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    return height;
                },
                // Sets the color of the progressbar and it's shadow. Use any valid HTML
                // color
                color: function (new_color) {
                    if (new_color !== undefined) {
                        color = new_color;
                        $scope.color = color;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    return color;
                },
                hide: function () {
                    progressbarEl.children().css('opacity', '0');
                    var self = this;
                    $timeout(function () {
                        progressbarEl.children().css('width', '0%');
                        $timeout(function () {
                            self.show();
                        }, 500);
                    }, 500);
                },
                show: function () {
                    $timeout(function () {
                        progressbarEl.children().css('opacity', '1');
                    }, 100);
                },
                // Returns on how many percent the progressbar is at. Should'nt be needed
                status: function () {
                    return count;
                },
                // Stops the progressbar at it's current location
                stop: function () {
                    clearInterval(intervalCounterId);
                },
                // Set's the progressbar percentage. Use a number between 0 - 100. 
                // If 100 is provided, complete will be called.
                set: function (new_count) {
                    this.show();
                    this.updateCount(new_count);
                    count = new_count;
                    clearInterval(intervalCounterId);
                    return count;
                },
                css: function (args) {
                    return progressbarEl.children().css(args);
                },
                // Resets the progressbar to percetage 0 and therefore will be hided after
                // it's rollbacked
                reset: function () {
                    clearInterval(intervalCounterId);
                    count = 0;
                    this.updateCount(count);
                    return 0;
                },
                // Jumps to 100% progress and fades away progressbar.
                complete: function () {
                    count = 100;
                    this.updateCount(count);
                    var self = this;
                    $timeout(function () {
                        self.hide();
                        $timeout(function () {
                            count = 0;
                            self.updateCount(count);
                        }, 500);
                    }, 1000);
                    return count;
                }
            };
        }];

        this.setColor = function (color) {
            if (color !== undefined) {
                this.color = color;
            }
            return this.color;
        };

        this.setHeight = function (height) {
            if (height !== undefined) {
                this.height = height;
            }
            return this.height;
        };
    });
angular.module('ngProgress.directive', [])
    .directive('ngProgress', ["$window", "$rootScope", function ($window, $rootScope) {
        var directiveObj = {
            // Replace the directive
            replace: true,
            // Only use as a element
            restrict: 'E',
            link: function ($scope, $element, $attrs, $controller) {
                // Watch the count on the $rootScope. As soon as count changes to something that
                // isn't undefined or null, change the counter on $scope and also the width of
                // the progressbar. The same goes for color and height on the $rootScope
                $rootScope.$watch('count', function (newVal) {
                    if (newVal !== undefined || newVal !== null) {
                        $scope.counter = newVal;
                        $element.eq(0).children().css('width', newVal + '%');
                    }
                });
                $rootScope.$watch('color', function (newVal) {
                    if (newVal !== undefined || newVal !== null) {
                        $scope.color = newVal;
                        $element.eq(0).children().css('background-color', newVal);
                        $element.eq(0).children().css('color', newVal);
                    }
                });
                $rootScope.$watch('height', function (newVal) {
                    if (newVal !== undefined || newVal !== null) {
                        $scope.height = newVal;
                        $element.eq(0).children().css('height', newVal);
                    }
                });
            },
            // The actual html that will be used
            template: '<div id="ngProgress-container"><div id="ngProgress"></div></div>'
        };
        return directiveObj;
    }]);

angular.module('ngProgress', ['ngProgress.directive', 'ngProgress.provider']);// Generated by CoffeeScript 1.6.2
(function() {
  var MODULE_NAME, SLIDER_TAG, angularize, bindHtml, gap, halfWidth, hide, inputEvents, module, offset, offsetLeft, pixelize, qualifiedDirectiveDefinition, roundStep, show, sliderDirective, width;

  MODULE_NAME = 'uiSlider';

  SLIDER_TAG = 'slider';

  angularize = function(element) {
    return angular.element(element);
  };

  pixelize = function(position) {
    return "" + position + "px";
  };

  hide = function(element) {
    return element.css({
      opacity: 0
    });
  };

  show = function(element) {
    return element.css({
      opacity: 1
    });
  };

  offset = function(element, position) {
    return element.css({
      left: position
    });
  };

  halfWidth = function(element) {
    return element[0].offsetWidth / 2;
  };

  offsetLeft = function(element) {
    return element[0].offsetLeft;
  };

  width = function(element) {
    return element[0].offsetWidth;
  };

  gap = function(element1, element2) {
    return offsetLeft(element2) - offsetLeft(element1) - width(element1);
  };

  bindHtml = function(element, html) {
    return element.attr('ng-bind-html-unsafe', html);
  };

  roundStep = function(value, precision, step, floor) {
    var decimals, remainder, roundedValue, steppedValue;

    if (floor == null) {
      floor = 0;
    }
    if (step == null) {
      step = 1 / Math.pow(10, precision);
    }
    remainder = (value - floor) % step;
    steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;
    decimals = Math.pow(10, precision);
    roundedValue = steppedValue * decimals / decimals;
    return roundedValue.toFixed(precision);
  };

  inputEvents = {
    mouse: {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    touch: {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend'
    }
  };

  sliderDirective = function($timeout) {
    return {
      restrict: 'EA',
      scope: {
        floor: '@',
        ceiling: '@',
        step: '@',
        precision: '@',
        ngModel: '=?',
        ngModelLow: '=?',
        ngModelHigh: '=?',
        translate: '&'
      },
      template: '<span class="bar"></span><span class="bar selection"></span><span class="pointer"></span><span class="pointer"></span><span class="bubble selection"></span><span ng-bind-html-unsafe="translate({value: floor})" class="bubble limit"></span><span ng-bind-html-unsafe="translate({value: ceiling})" class="bubble limit"></span><span class="bubble"></span><span class="bubble"></span><span class="bubble"></span>',
      compile: function(element, attributes) {
        var ceilBub, cmbBub, e, flrBub, fullBar, highBub, lowBub, maxPtr, minPtr, range, refHigh, refLow, selBar, selBub, watchables, _i, _len, _ref, _ref1;

        if (attributes.translate) {
          attributes.$set('translate', "" + attributes.translate + "(value)");
        }
        range = (attributes.ngModel == null) && ((attributes.ngModelLow != null) && (attributes.ngModelHigh != null));
        _ref = (function() {
          var _i, _len, _ref, _results;

          _ref = element.children();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            _results.push(angularize(e));
          }
          return _results;
        })(), fullBar = _ref[0], selBar = _ref[1], minPtr = _ref[2], maxPtr = _ref[3], selBub = _ref[4], flrBub = _ref[5], ceilBub = _ref[6], lowBub = _ref[7], highBub = _ref[8], cmbBub = _ref[9];
        refLow = range ? 'ngModelLow' : 'ngModel';
        refHigh = 'ngModelHigh';
        bindHtml(selBub, "'Range: ' + translate({value: diff})");
        bindHtml(lowBub, "translate({value: " + refLow + "})");
        bindHtml(highBub, "translate({value: " + refHigh + "})");
        bindHtml(cmbBub, "translate({value: " + refLow + "}) + ' - ' + translate({value: " + refHigh + "})");
        if (!range) {
          _ref1 = [selBar, maxPtr, selBub, highBub, cmbBub];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            element = _ref1[_i];
            element.remove();
          }
        }
        watchables = [refLow, 'floor', 'ceiling'];
        if (range) {
          watchables.push(refHigh);
        }
        return {
          post: function(scope, element, attributes) {
            var barWidth, boundToInputs, dimensions, maxOffset, maxValue, minOffset, minValue, ngDocument, offsetRange, pointerHalfWidth, updateDOM, valueRange, w, _j, _len1;

            boundToInputs = false;
            ngDocument = angularize(document);
            if (!attributes.translate) {
              scope.translate = function(value) {
                return value.value;
              };
            }
            pointerHalfWidth = barWidth = minOffset = maxOffset = minValue = maxValue = valueRange = offsetRange = void 0;
            dimensions = function() {
              var value, _j, _len1, _ref2, _ref3;

              if ((_ref2 = scope.precision) == null) {
                scope.precision = 0;
              }
              if ((_ref3 = scope.step) == null) {
                scope.step = 1;
              }
              for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
                value = watchables[_j];
                scope[value] = roundStep(parseFloat(scope[value]), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
              }
              scope.diff = roundStep(scope[refHigh] - scope[refLow], parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
              pointerHalfWidth = halfWidth(minPtr);
              barWidth = width(fullBar);
              minOffset = 0;
              maxOffset = barWidth - width(minPtr);
              minValue = parseFloat(attributes.floor);
              maxValue = parseFloat(attributes.ceiling);
              valueRange = maxValue - minValue;
              return offsetRange = maxOffset - minOffset;
            };
            updateDOM = function() {
              var adjustBubbles, bindToInputEvents, fitToBar, percentOffset, percentToOffset, percentValue, setBindings, setPointers;

              dimensions();
              percentOffset = function(offset) {
                return ((offset - minOffset) / offsetRange) * 100;
              };
              percentValue = function(value) {
                return ((value - minValue) / valueRange) * 100;
              };
              percentToOffset = function(percent) {
                return pixelize(percent * offsetRange / 100);
              };
              fitToBar = function(element) {
                return offset(element, pixelize(Math.min(Math.max(0, offsetLeft(element)), barWidth - width(element))));
              };
              setPointers = function() {
                var newHighValue, newLowValue;

                offset(ceilBub, pixelize(barWidth - width(ceilBub)));
                newLowValue = percentValue(scope[refLow]);
                offset(minPtr, percentToOffset(newLowValue));
                offset(lowBub, pixelize(offsetLeft(minPtr) - (halfWidth(lowBub)) + pointerHalfWidth));
                if (range) {
                  newHighValue = percentValue(scope[refHigh]);
                  offset(maxPtr, percentToOffset(newHighValue));
                  offset(highBub, pixelize(offsetLeft(maxPtr) - (halfWidth(highBub)) + pointerHalfWidth));
                  offset(selBar, pixelize(offsetLeft(minPtr) + pointerHalfWidth));
                  selBar.css({
                    width: percentToOffset(newHighValue - newLowValue)
                  });
                  offset(selBub, pixelize(offsetLeft(selBar) + halfWidth(selBar) - halfWidth(selBub)));
                  return offset(cmbBub, pixelize(offsetLeft(selBar) + halfWidth(selBar) - halfWidth(cmbBub)));
                }
              };
              adjustBubbles = function() {
                var bubToAdjust;

                fitToBar(lowBub);
                bubToAdjust = highBub;
                if (range) {
                  fitToBar(highBub);
                  fitToBar(selBub);
                  if (gap(lowBub, highBub) < 10) {
                    hide(lowBub);
                    hide(highBub);
                    fitToBar(cmbBub);
                    show(cmbBub);
                    bubToAdjust = cmbBub;
                  } else {
                    show(lowBub);
                    show(highBub);
                    hide(cmbBub);
                    bubToAdjust = highBub;
                  }
                }
                if (gap(flrBub, lowBub) < 5) {
                  hide(flrBub);
                } else {
                  if (range) {
                    if (gap(flrBub, bubToAdjust) < 5) {
                      hide(flrBub);
                    } else {
                      show(flrBub);
                    }
                  } else {
                    show(flrBub);
                  }
                }
                if (gap(lowBub, ceilBub) < 5) {
                  return hide(ceilBub);
                } else {
                  if (range) {
                    if (gap(bubToAdjust, ceilBub) < 5) {
                      return hide(ceilBub);
                    } else {
                      return show(ceilBub);
                    }
                  } else {
                    return show(ceilBub);
                  }
                }
              };
              bindToInputEvents = function(pointer, ref, events) {
                var onEnd, onMove, onStart;

                onEnd = function() {
                  pointer.removeClass('active');
                  ngDocument.unbind(events.move);
                  return ngDocument.unbind(events.end);
                };
                onMove = function(event) {
                  var eventX, newOffset, newPercent, newValue;

                  eventX = event.clientX || event.touches[0].clientX;
                  newOffset = eventX - element[0].getBoundingClientRect().left - pointerHalfWidth;
                  newOffset = Math.max(Math.min(newOffset, maxOffset), minOffset);
                  newPercent = percentOffset(newOffset);
                  newValue = minValue + (valueRange * newPercent / 100.0);
                  if (range) {
                    if (ref === refLow) {
                      if (newValue > scope[refHigh]) {
                        ref = refHigh;
                        minPtr.removeClass('active');
                        maxPtr.addClass('active');
                      }
                    } else {
                      if (newValue < scope[refLow]) {
                        ref = refLow;
                        maxPtr.removeClass('active');
                        minPtr.addClass('active');
                      }
                    }
                  }
                  newValue = roundStep(newValue, parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
                  scope[ref] = newValue;
                  return scope.$apply();
                };
                onStart = function(event) {
                  pointer.addClass('active');
                  dimensions();
                  event.stopPropagation();
                  event.preventDefault();
                  ngDocument.bind(events.move, onMove);
                  return ngDocument.bind(events.end, onEnd);
                };
                return pointer.bind(events.start, onStart);
              };
              setBindings = function() {
                var bind, inputMethod, _j, _len1, _ref2, _results;

                boundToInputs = true;
                bind = function(method) {
                  bindToInputEvents(minPtr, refLow, inputEvents[method]);
                  return bindToInputEvents(maxPtr, refHigh, inputEvents[method]);
                };
                _ref2 = ['touch', 'mouse'];
                _results = [];
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  inputMethod = _ref2[_j];
                  _results.push(bind(inputMethod));
                }
                return _results;
              };
              setPointers();
              adjustBubbles();
              if (!boundToInputs) {
                return setBindings();
              }
            };
            $timeout(updateDOM);
            for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
              w = watchables[_j];
              scope.$watch(w, updateDOM);
            }
            return window.addEventListener("resize", updateDOM);
          }
        };
      }
    };
  };

  qualifiedDirectiveDefinition = ['$timeout', sliderDirective];

  module = function(window, angular) {
    return angular.module(MODULE_NAME, []).directive(SLIDER_TAG, qualifiedDirectiveDefinition);
  };

  module(window, window.angular);

}).call(this);
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

/* Controllers */

baseApp.controller('SongSearchCtrl', ['$scope','$http', '$document', 'loginService', function($scope, $http, $document, loginService) {
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
	
}]);

baseApp.controller("SongSelectionCtrl",['$scope','$http', 'ngProgress', 'loginService', function ($scope, $http, ngProgress, loginService) {
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
}]);
