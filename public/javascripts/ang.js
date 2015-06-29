
var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home',{
        templateUrl: '/views/home.html'
      }).
      when('/men', {
        templateUrl: '/views/menpage.html',
        controller: 'game'
      }).
      when('/women', {
        templateUrl: '/views/womenpage.html',
        controller: 'game2'
      }).
      when('/about', {
        templateUrl: '/views/about.html'
      }).
      when('/profile/:playerfname',{
        templateUrl: '/views/profile.html',
        controller: 'game3'
      }).
      when('/request',{
        templateUrl: '/views/memberform.html',
        controller: 'game4'
      }).
      when('/captain',{
        templateUrl: '/views/captain.html',
        controller: 'game5'
      }).
      when('/captainView',{
        templateUrl: '/views/captainView.html',
        controller: 'game6'
      }).
      when('/contactus',{
        templateUrl: '/views/contactus.html',
        controller: 'game7'
      }).
      otherwise({redirectTo: '/home'});
  }]);


/*Two functions logic below from http://stackoverflow.com/questions/12505760/processing-http-response-in-service
(Asynchronous waterfall)*/
myApp.factory('malePlayers', function($http) { 
  var malePlayers = {
    async: function() {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get('/maleTeam').then(function (response) {
        // The then function here is an opportunity to modify the response
        //console.log(response);
        // The return value gets picked up by the then in the controller.
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    }
  };
  //console.log(myService);
  return malePlayers;
});


myApp.factory('femalePlayers', function($http) { 
  var femalePlayers = {
    async: function() {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get('/femaleTeam').then(function (response) {
        // The then function here is an opportunity to modify the response
        //console.log(response);
        // The return value gets picked up by the then in the controller.
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    }
  };
  //console.log(myService);
  return femalePlayers;
});



myApp.controller('game', ['$scope', 'malePlayers',
  function($scope, malePlayers) {
     malePlayers.async().then(function(d) {
      //console.log(d);
      $scope.players = d; //actual male players list
    })}
 ]);

myApp.controller('game2',['$scope', 'femalePlayers',
	function($scope, femalePlayers) {
    femalePlayers.async().then(function(d) {
      //console.log(d);
      $scope.players = d; //actual female players list
    })}
]);


myApp.controller('game3', ['$scope','$routeParams', '$http',

  function($scope, $routeParams, $http) {
    $http.get('/players')
    .success(function(response) {
      //console.log(response[1].name)
      for(i=0; i<response.length ; i++ ){
        //console.log('looping');
        if(response[i].fname == $routeParams.playerfname){
           $scope.playerD = response[i];
           $scope.name=$scope.playerD.fname +" "+ $scope.playerD.lname;
           $scope.classyear=$scope.playerD.classyear;
           $scope.position=$scope.playerD.position;
           $scope.hobbies=$scope.playerD.hobbies;
        }
      }
    })
    $scope.playerId = $routeParams.playerfname;
    //$scope.playerData=$scope.playerD;
    
    //console.log($routeParams)
    //console.log($scope.playerData);
  }
 ]);

myApp.controller('game4', ['$scope', '$http', '$location',
  function($scope, $http, $location) {

    $scope.user = {fname: "",lname: "", classyear: "" , hobbies: "", prevexperience: "", sex:"",team:"", position:""};
    $scope.experienceyes = false;
    $scope.experienceno = true;
    
    $scope.postInfo = function(){
      $location.path('/home');
      $http.post('/memberrequest',$scope.user)
      .success(function(response){

        //console.log("sent");
      })
      //console.log($scope.user);
    };
  }]);

myApp.controller('game5', ['$scope', '$http', '$location' ,
  function($scope,$http,$location) {
    $scope.captain={uname:"", pword:""};
     $scope.verify2 = function(){
      $http.get('/captainLogin')
      .success(function(response) {
        $scope.match=response;
        //console.log($scope.match);
        if($scope.match =='Yes'){
          $location.path('/captainView');
        }
    });
    }


    $scope.verify = function(){
      //console.log($scope.captain)
      $http.post('/postCaptainInfo',$scope.captain)
      .success(function(response){
        //console.log(response);
        //console.log("sent");
        $scope.verify2();
      })
    }
    }
  ]);

myApp.controller('game6', ['$scope', '$http', '$location', '$routeParams', '$route',
  function($scope, $http, $location, $routeParams,$route) {
    $scope.accepted={};
    $scope.rejected={};
    $http.get('/captainapproval')
    .success(function(response){
      $scope.requests=response;
      $scope.requestList = [];
      $scope.number_of_requests= response.length;
      for(i=0; i<response.length ; i++){
          //$scope.accepted[response[i].lname]='';
          $scope.requestList.push({fname:response[i].fname , lname:response[i].lname , 
            prevexperience:response[i].prevexperience , position:response[i].position});
      }
      //console.log($scope.requests);
    });
    
    $scope.acceptedPlayers = function(a){
      console.log(a)
      console.log({lname:a})
      // for(i=0 ;i<response.length ; i++){
      //   if(response[i].lname == a){
      //     $scope.accepted.push(response[i]);
      //   }
      // }
      $http.post('/playerAcceptance', {lname:a}).
      success(function(response){
        console.log(response);
        $route.reload();
      })
    }

    $scope.rejectedPlayers = function(a){
      console.log(a)
      $http.post('/playerReject',{lname:a}).
      success(function(response){
        console.log(response);
        $route.reload();
      })
    }
  }
 ]);

myApp.controller('game7',['$scope','$http','$location',
  function($scope,$http,$location){
    $scope.emailBody = {to:'mibrahim17@amherst.edu',from:"",subject:"",text:""};
    $scope.sendEmail = function(){
      $http.post('/sendEmail', $scope.emailBody).
      success(function(response){
        console.log(response);
        $location.path('/home');
      })
    }
  }
  ]);



