var app = angular.module("myapp", ["firebase"]);
	
	app.controller("MyController", function($scope,$http, $firebase) {

		var map = L.map('map').setView([23.683919, 38.064295].reverse(), 10);

	   	L.tileLayer('http://{s}.tiles.mapbox.com/v3/your-mapbox-api-key/{z}/{x}/{y}.png', {
	   		unloadInvisibleTiles: true,
        	updateWhenIdle: true,
        	reuseTiles: true,   		
	   		maxZoom: 18
		}).addTo(map);
    		
    	var download,upload,latency,ip_address,jitter,testServer;
    	var vis = false;
    	$scope.myCounty ='';
    	$scope.submitBox = false;
    	$scope.testBtn = true;
    	$scope.bench= true;
    	$scope.map=false;
    	$scope.explore=false;

    	$scope.isps = [
      		{name:'Otenet/Cosmote'},
      		{name:'Forthnet'},
      		{name:'Cyta'},
      		{name:'Hol'},
      		{name:'Vodafone'},
      		{name:'Wind'},
      		{name:'Other'}      		
    	];

    	$scope.connection ='aDsl';

    	var speedlab = new Firebase("https://your-firebase-name.firebaseio.com/results");
    	var today = new Date().toJSON().slice(0,10);
    	var dayResults = speedlab.child(today); 	    	 	

  		$scope.results = $firebase(dayResults);
  		$scope.counties = $firebase(new Firebase("https://your-firebase-name.firebaseio.com/counties")).$asObject();

  		$scope.countiesFromDB = [];

  		$scope.counties.$loaded().then(function(){
  			for(var key in $scope.counties[0]){
  				$scope.countiesFromDB.push(key);
  			}  			
  		}); 		

  		$scope.submit = function() {
  			$scope.testResult = {'Download':download,'Upload':upload,'Latency':latency,'Ip_address':ip_address,'Jitter':jitter,'TestServer':testServer,'Counties':$scope.myCounty, 'Isp':$scope.myIsp.name, 'Connection':$scope.connection}
    		$scope.results.$push($scope.testResult);
    		document.getElementById('submitBox').style.display='none';
    		document.getElementById('successmsg').style.display='';
    		$scope.explore=true;
    		//console.log(download,upload,latency,ip_address,jitter,testServer);
  		}

  		SomApi.account = "Your speedof.me account";   
		SomApi.domainName = "Your domain name";      
		SomApi.config.sustainTime = 4; 
		SomApi.onTestCompleted = onTestCompleted;
		SomApi.onError = onError;

		var msgDiv = document.getElementById("msg");
	
		$scope.btnStartClick = function() {
			document.getElementById('loading').style.display='';
			$scope.testBtn = false;
		 	msgDiv.innerHTML = "<h3>Speed test in progress. Please wait...</h3>";
			SomApi.startTest();
		}	

		function onTestCompleted(testResult) {
			download=testResult.download;
			upload=testResult.upload;
			latency=testResult.latency;
			ip_address=testResult.ip_address;
			jitter=testResult.jitter;
			testServer=testResult.testServer;		

			document.getElementById('submitBox').style.display='';
			document.getElementById('loading').style.display='none';

			console.log(download,upload,latency,ip_address,jitter,testServer);

			msgDiv.innerHTML = 
			"<p style='font-size:14px;'>"+
				"Download: "   +testResult.download +"Mbps <br/>"+
				"Upload: "     +testResult.upload   +"Mbps <br/>"+
				"Latency: "    +testResult.latency  +"ms <br/>"
			"</h3>";

		}
		
		function onError(error) {
			msgDiv.innerHTML = "Error "+ error.code + ": "+error.message;
		}


	$scope.init = function() {        
        $http.get("http://your-domain-name/dimoi_markers.json").
             success(function(data, status) {
           	//console.log(data);
           		var obj=data;
				var polygon = {};
				var multipolygon = {};					   	

				   	for(var dimos in obj){
				   		L.marker(obj[dimos].reverse()).addTo(map)				   					   		
				   	};
				   	
				   	$scope.map='true';

            }).
            error(function(data, status) {
              console.log(data || "Request failed");
          });
     }
});

	