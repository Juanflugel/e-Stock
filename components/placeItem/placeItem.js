
angular.module('eStock.placeItem', ['eStock.services'])

.controller('placeItemCrtl', ['$scope','shop','$cordovaBarcodeScanner',function ($scope,shop,$cordovaBarcodeScanner){


	shop.company.query(function (data){
		console.log('bien');
		$scope.firma = data[0];
	},function (err){

	});

	var firmaId = 'RMB01';

	shop.project.query({companyId:firmaId},function (data){
		$scope.locations = data;
	});

	$scope.takeItem = function(){

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
						 $scope.transfer = true;
			 		}
					 
				 },function(queryerr){
				 	alert(queryerror);
				 });

		  },function(scanerror) {
		  // An error occurred
	   });
        
	}

	$scope.itemToProject = function (projectId){
		console.log(projectId);
		shop.projectUpdate.update({projectNumber:projectId},$scope.readObj,function (data){
			alert('item insert in porject: '+ projectId)
			$scope.transfer = false;
		});

	}


}])