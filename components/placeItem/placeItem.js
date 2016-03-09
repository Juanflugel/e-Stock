
angular.module('eStock.placeItem', ['eStock.services'])

.controller('placeItemCrtl', ['$scope','shop','$cordovaBarcodeScanner',function ($scope,shop,$cordovaBarcodeScanner){

	console.log('tu perra madre');
	$scope.firma = 'monda';
	shop.company.query(function (data){
		console.log('bien');
		$scope.firma = data[0];
		$scope.locations = $scope.firma.companyLocations;
	},function (err){

	});

	$scope.moveItem = function(){

		$cordovaBarcodeScanner.scan().then(function(barcodeData) {
			 const code = String(barcodeData.text);
			 const type = String(barcodeData.format);
			 shop.itemId.query({idCode:code},function (data) {
			 			 	
			 		if (data.length == 0){
			 			alert('The Scaned code is not registered yet');
			 		}
			 		else{
			 			 $scope.readObj = data[0];
						 $scope.whileObj = angular.copy($scope.readObj);
						 $scope.show = true;
			 		}
					 
				 },function(queryerr){
				 	alert(queryerror);
				 });

		  },function(scanerror) {
		  // An error occurred
	   });
        
	}

}])