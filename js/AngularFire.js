var app = angular.module("hereVoice", ['firebase']);  

//section to save markers from database

var ref = new Firebase("https://herevoice.firebaseio.com/");

ref.child("Markers").orderByChild("marker").on("child_added", function(snapshot) {
    console.log(snapshot.val());
    var temp = [];
    temp.push(snapshot.val().title);
    temp.push(snapshot.val().latitude);
    temp.push(snapshot.val().longitude);
    markers.push(temp);
});

app.controller("Auth", function ($scope, $firebaseArray, $http) {
	var firebaseURL = "https://herevoice.firebaseio.com/";
	$scope.FBLogin = function () {
    var ref = new Firebase(firebaseURL);
    // section to login
	    ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
			console.log("Login Failed!", error);
			} else {
				$scope.$apply(function() {
				$scope.$authData = authData;
				$scope.profile_URL = authData.facebook.profileImageURL;
				$scope.profile_name = authData.facebook.displayName
				});
		        console.log("Authenticated successfully with payload:", authData);
		        initMap(); // map reset because of hide and show in angularJS
		      
		    // do something with the login info

			    ref.onAuth(function(authData){
			      	var echoRef = new Firebase(firebaseURL + "/Users/");
			      	if(authData){
				      	echoRef.once('value', function(snapshot) {
				      		if(!snapshot.hasChild(authData.uid)) {
				      			echoRef.child(authData.uid).set({
						      		display_name: authData.facebook.displayName,
						      		id: authData.facebook.id,
						      		profile_img: authData.facebook.profileImageURL
						      	});
				      		}
				      	});
			      	}
				});
	     	}
	    });
		
    };
    // section end

    $scope.$timeline = [];

    $scope.addToTimeline = function(voice) {
    	$scope.$apply(function() {
    		$scope.$timeline.push(voice);
    	});
    }

    $scope.$watch('$timeline', function() {
    	console.log('change detect', $scope.$timeline);
    });

    
});
