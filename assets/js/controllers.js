!function(){
"use strict";
var regis = angular.module("regis", [
	"ngResource", "ngSanitize", "ui.router"
]).run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams){
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);

regis.config(["$stateProvider", function(provider){
	provider.state("list", {
		url: "",
		views: {
			"@": {
				templateUrl: "templates/list.html",
				controller: "ListController"
			},
		},
	});
	provider.state("add", {
		url: "/add",
		views: {
			"@": {
				templateUrl: "templates/add.html",
				controller: "AddController"
			},
		},
	});
}]);

regis.factory("Register", ["$resource", function($resource){
	return $resource("/server/register/:id");
}]);

regis.controller("ListController", ["$scope", "$rootScope", "$timeout", "Register", function($scope, $rootScope, $timeout, Register){
	$rootScope.title = "";

	$scope.setArrive = function(user, arrived){
		if(arrived){
			user.arrived = true;
		}else{
			user.arrived = false;
		}
		user.$save(function(out){
			$angular.copy(out, user);
		});
	};

	$scope.sort = "name";
	$scope.reverse = false;

	var timer;

	var refresh = function(){
		Register.query(function(data){
			$scope.regis = data;
			timer = $timeout(refresh, 2000);
		});
	};
	refresh();

	$scope.$on("$destroy", function(){
		$timeout.cancel(timer);
	});
}]);

regis.controller("AddController", ["$scope", "$rootScope", "Register", function($scope, $rootScope, Register){
	$rootScope.title = "Add";
	$scope.saved = null;
	$scope.save = function(){
		var newItem = new Register($scope.add);
		newItem.$save(function(user){
			$scope.saved = user;
		});
		$scope.add = {};
	};
}]);


}();