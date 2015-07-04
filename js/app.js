var kspToolsApp = angular.module('kspToolsApp', [
  'ngRoute',
  'kspToolsControllers'
]);


kspToolsApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/orbit/darknesstime', {
                templateUrl: 'templates/orbit/darkness-time.html',
                controller: 'OrbitDarknessTimeCtrl'
            }).
            when('/orbit/information', {
                templateUrl: 'templates/orbit/information.html',
                controller: 'OrbitInfoCtrl'
            }).
            when('/orbit/maneuver', {
                templateUrl : 'templates/orbit/maneuver.html',
                controller: 'ManeuverPlannerCtrl'
            }).
            when('/satellite', {
                templateUrl: 'templates/satellite.html',
                controller: 'SatelliteCtrl'
            }).
            when('/lifesupport', {
                templateUrl: 'templates/lifesupport.html',
                controller: 'LifeSupportCtrl'
            }).
            otherwise({
                redirectTo: '/orbit/darknesstime'
            });
    }
]);