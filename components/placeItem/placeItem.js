
angular.module('eStock.placeItem', ['eStock.services'])

.controller('placeItemCrtl', ['$scope','shop','$cordovaBarcodeScanner',function ($scope,shop,$cordovaBarcodeScanner){

	$scope.whileObj = {};

	$scope.forgetToPlace = function(){
		angular.copy($scope.whileObj,$scope.readObj);
		$scope.editAmount = false;
	}

	$scope.defineAmount = function(){
		console.log('tu perra madre');
		$scope.editAmount = true;
	}
	// query db the company Objetc
	shop.company.query(function (data){
		console.log('bien');
		$scope.firma = data[0];
	},function (err){

	});

	var firmaId = 'RMB01';

	// query from DB all the projects that belong to the company
	shop.project.query({companyId:firmaId},function (data){
		$scope.locations = data;
	});
	// scan an Item and bring all the information from DB
	$scope.takeItem = function(){

		$cordovaBarcodeScanner.scan().then(function(barcodeData) {
			 const code = String(barcodeData.text).toUpperCase();;
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
	// set the item and amount to the item array inisde a project
	$scope.itemToProject = function (projectId){
		var obj = $scope.readObj;
		console.log(projectId);
		// query for insert intem in project
		shop.projectUpdate.update({projectNumber:projectId},$scope.readObj,function (data){			
			$scope.transfer = false;
			const takenAmount = obj.itemAmount;
			const newAmount = $scope.whileObj.itemAmount-takenAmount;
			// query for update new amount
			obj.itemAmount = newAmount;

			shop.itemUpdate.update({idCode:obj.itemCode},obj,function (data){
			 	alert('item insert in porject: '+ projectId);
			
			}, function(error){
				alert('The item amount was not updated');
			});

		});

	}


}])