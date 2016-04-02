
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
	shop.project.query({companyId:firmaId,isSubAssembly:0,projectState:'open'},function (data){
		$scope.projects = data;
	});
	// scan an Item and bring all the information from DB
	$scope.takeItem = function(){

		$cordovaBarcodeScanner.scan().then(function(barcodeData) {
			 const code = String(barcodeData.text).toUpperCase();;
			 const type = String(barcodeData.format);
			 var query = {};
			 query.itemCode = code;
			 query.companyId = firmaId;
			 shop.itemId.query(query,function (data) {
							
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
	$scope.itemToProject = function (proNumber){
		var query = {};
		query.projectNumber = proNumber;
		var obj = $scope.readObj;
		// query for insert intem in project
		shop.projectUpdate.update(query,$scope.readObj,function (data){			
			$scope.transfer = false;
			const takenAmount = obj.itemAmount;
			const newAmount = $scope.whileObj.itemAmount-takenAmount;
			// query for update new amount
			obj.itemAmount = newAmount;

			shop.itemUpdate.update({itemCode:obj.itemCode},obj,function (data){
			 	alert('item insert in porject: '+ projectId);
			
			}, function(error){
				alert('The item amount was not updated');
			});

		});

	}


}])